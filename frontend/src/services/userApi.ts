import { api } from "@/lib/axios";

export const getProfile =
 async () => {

  const response =
   await api.get(
     "/auth/profile"
   );

  return response.data;
};