import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const publicRoutes = ["/login", "/register", "/"] as const;

const isPublicRoute = (path: string) => {
  if (!path) return false;
  return publicRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
};

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Crucial: enables sending HTTP-only cookies
  validateStatus: (status) => status >= 200 && status < 300,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Catches expired sessions/unauthorized responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const responseData = error.response?.data;
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";

    let message = "Something went wrong";
    if (responseData) {
      if (typeof responseData === "string") {
        message = responseData.slice(0, 200);
      } else if (responseData.message) {
        message = responseData.message;
      } else if (responseData.error) {
        message = responseData.error;
      }
    }

    const publicRoute = isPublicRoute(currentPath);

    // If unauthorized (401) on a protected route, and we haven't retried yet:
    if (
      !publicRoute &&
      status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Request token refresh from the backend
        const refreshResponse = await axios.post(
          `${baseURL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = refreshResponse.data;
        if (accessToken) {
          // Set client-readable cookie for middleware (expires in 15 mins)
          Cookies.set("access", accessToken, { expires: 1 / 96 });
          processQueue(null, accessToken);
          isRefreshing = false;
          // Retry the original request
          return api(originalRequest);
        } else {
          throw new Error("No access token returned from refresh endpoint");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Clear client-readable cookies
        Cookies.remove("access");

        // Redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(
          new Error("Session expired. Redirecting to login...")
        );
      }
    }

    // Fallback: If any other 401/403 or token error happens, perform cleanup
    if (
      !publicRoute &&
      (status === 401 ||
        status === 403 ||
        (message &&
          (message.toLowerCase().includes("unauthorized") ||
            message.toLowerCase().includes("token expired") ||
            message.toLowerCase().includes("unauthenticated") ||
            message.toLowerCase().includes("invalid token"))))
    ) {
      // Clear client-readable cookies
      Cookies.remove("access");

      // Optionally redirect to login in browser
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(
        new Error("Session expired. Redirecting to login...")
      );
    }

    if (error.response) {
      error.message = message;
    }

    return Promise.reject(error);
  }
);

export default api;

