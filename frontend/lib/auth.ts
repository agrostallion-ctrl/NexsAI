/**
 * Authentication Utility (JWT Version)
 * Handles storage, retrieval, and automatic expiration validation.
 */

const TOKEN_KEY = "auth_token";
const isBrowser = typeof window !== "undefined";

/**
 * Persists the token to localStorage.
 */
export const setToken = (token: string): void => {
  if (isBrowser) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Removes the token and logs the user out.
 */
export const logout = (): void => {
  if (isBrowser) {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Retrieves the token if it exists and is not expired.
 * Automatically clears the token if it has expired.
 */
export const getToken = (): string | null => {
  if (!isBrowser) return null;

  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    // 1. Split the JWT and decode the Payload (middle part)
    // atob decodes Base64; JSON.parse converts the string to an object
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Standardize Base64
    const payload = JSON.parse(window.atob(base64));

    // 2. ⏰ Expiry Check
    // JWT exp is in seconds; Date.now() is in milliseconds
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      console.warn("Token expired. Logging out...");
      logout();
      return null;
    }

    return token;
  } catch (error) {
    // If the token is malformed or decoding fails, treat it as invalid
    console.error("Invalid token format:", error);
    logout();
    return null;
  }
};

export const getUser = (): any | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(base64));

    return payload; // 👈 contains id, email, role, etc.
  } catch {
    return null;
  }
};