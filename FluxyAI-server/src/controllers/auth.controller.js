import authService from "../services/auth.service.js";

class AuthController {
  // Rahul registration API start here:
  // Add register(req, res, next), call authService.register(req.body),
  // and return 201 with public user data only. Do not return password.

  async refreshToken(req, res, next) {
    try {
      const oldRefreshToken = req.cookies?.refreshToken;

      const result = await authService.refreshToken(oldRefreshToken);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
