import { api } from "@/lib/axios";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await api.post("/auth/register", { name, email, password });
  return response.data;
};

export const loginUser = async (
  email: string,
  password: string
) => {

  const response =
    await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

  return response.data;
};

export const googleLogin = async (credential: string) => {
  const response = await api.post(
    "/auth/google",
    {
      credential,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post(
    "/auth/refresh-token"
  );
  return response.data;
};