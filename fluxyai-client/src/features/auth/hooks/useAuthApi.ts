import { useMutation } from "@tanstack/react-query";
import * as api from "@/api";
import {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
} from "@/types";

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationKey: ["login"],
    mutationFn: (data: LoginCredentials) => api.login(data),
    retry: 0,
  });
};

export const useRegister = () => {
  return useMutation<RegisterResponse, Error, RegisterCredentials>({
    mutationKey: ["register"],
    mutationFn: (data: RegisterCredentials) => api.register(data),
    retry: 0,
  });
};

// You can define useLogout hook here similarly