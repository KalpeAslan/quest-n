import { LocalStorageService } from "@services";
import { appConfig } from "@/app.config";

export const refreshAccessToken = async refreshToken => {
  let newAccessToken = await LocalStorageService.getItemAsync("au-t");
  let error = null;
  const data = await fetch(
    `${appConfig.NEXT_PUBLIC_API_HOST}/auth/refresh-token`,
    {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
      headers: {
        "content-type": "application/json",
      },
    },
  )
    .then(res => {
      if (res.status === 401) {
        const event = new StorageEvent("storage", {
          key: "401",
          newValue: null,
        });
        window.dispatchEvent(event);
        throw new Error("Unauthorized");
      }
      return res.json();
    })
    .catch(err => {
      error = err;
    });

  if (error) return newAccessToken;

  if (!data.accessToken) return newAccessToken;

  LocalStorageService.setItem("au-t", data.accessToken);

  newAccessToken = data.accessToken;

  LocalStorageService.setItem("au-t", newAccessToken);
  return newAccessToken;
};

export function isTokenExpired(token: string): boolean {
  try {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}
