export class SessionStorageService {
  public static setItem(key: string, value: any): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log("Session storage isn't defined");
    }
  }

  public static getItem(key: string): any | null {
    try {
      const value = sessionStorage.getItem(key);
      if (!value) return null;
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  }

  public static removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.log("Session storage isn't defined");
    }
  }

  public static clear(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.log("Session storage isn't defined");
    }
  }
}
