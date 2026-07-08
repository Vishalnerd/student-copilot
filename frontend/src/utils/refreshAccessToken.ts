import axios from "axios";

let refreshPromise: Promise<void> | null = null;

export async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {})
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}