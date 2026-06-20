import api from "@/config/axios";
import { RegisterCredentials, RegisterResponse } from "@/types";

export const register = async (
  data: RegisterCredentials
): Promise<RegisterResponse> => {
  const response = await api.post("/api/auth/register", data);
  return response.data;
};
