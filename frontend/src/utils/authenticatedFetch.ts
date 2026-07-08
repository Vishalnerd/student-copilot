import { refreshAccessToken } from "./refreshAccessToken";

export async function authenticatedFetch(
  input: RequestInfo,
  init?: RequestInit
) {
  const makeRequest = () =>
    fetch(input, {
      ...init,
      credentials: "include",
    });

  let response = await makeRequest();

  if (response.status === 401) {
    try {
      await refreshAccessToken();

      response = await makeRequest();
    } catch {
      window.location.replace("/login");
      throw new Error("Session expired");
    }
  }

  return response;
}