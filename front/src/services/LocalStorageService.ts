export class LocalStorageService {
  private static getIsSSR = () => typeof window === "undefined";

  public readonly length: number;

  constructor() {
    try {
      if (typeof window === "undefined") this.length = 0;
      this.length = localStorage.length;
    } catch (error) {
      if (error.code === 18) {
        this.length = 0;
      }
    }
  }

  public static get accessToken() {
    return this.getItem("au-t");
  }

  public static getItem(key: string): string | null {
    try {
      if (this.getIsSSR()) return null;
      return localStorage.getItem(key);
    } catch (error) {
      console.log("error");
    }
  }

  public static async getItemAsync(key: string): Promise<string | null> {
    try {
      if (this.getIsSSR()) return null;
      return localStorage.getItem(key);
    } catch (error) {
      if (error.code === 18) {
        parent.postMessage(
          {
            type: "localStorage",
            method: "getItem",
            data: { key },
          },
          "*",
        );

        const value: string | null = await new Promise(resolve => {
          const listener = (e: MessageEvent) => {
            if (
              e.data.type === "localStorage" &&
              e.data.method === "getItemResult" &&
              e.data.data.key === key
            ) {
              window.removeEventListener("message", listener);
              resolve(e.data.data.value);
            }
          };

          window.addEventListener("message", listener);
        });

        return value;
      }
    }
  }

  public static setItem(key: string, value: any) {
    try {
      if (this.getIsSSR()) return;
      localStorage.setItem(
        key,
        typeof value === "string" ? value : JSON.stringify(value),
      );
    } catch (error) {
      if (error.code === 18) {
        parent.postMessage(
          {
            type: "localStorage",
            method: "setItem",
            data: { key, value },
          },
          "*",
        );
      }
    }
  }

  public static removeItem(key: string) {
    try {
      if (this.getIsSSR()) return;
      localStorage.removeItem(key);
    } catch (error) {
      if (error.code === 18) {
        parent.postMessage(
          {
            type: "localStorage",
            method: "removeItem",
            data: { key },
          },
          "*",
        );
      }
    }
  }

  public static clear() {
    try {
      if (this.getIsSSR()) return;
      localStorage.clear();
    } catch (error) {
      if (error.code === 18) {
        parent.postMessage(
          {
            type: "localStorage",
            method: "clear",
          },
          "*",
        );
      }
    }
  }

  public static key(i: number) {
    try {
      if (this.getIsSSR()) return null;

      return localStorage.key(i);
    } catch (error) {
      if (error.code === 18) {
        return null;
      }
    }
  }
}
