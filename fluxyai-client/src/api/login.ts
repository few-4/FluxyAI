import api from "@/config/axios";
import { LoginCredentials, LoginResponse } from "@/types";

export const login = async (data: LoginCredentials): Promise<LoginResponse> => {
  const response = await api.post("/api/auth/login", data);
  return response.data;
};

