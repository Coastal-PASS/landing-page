import { env } from "./env";

interface GnssRequestOptions extends RequestInit {
  /**
   * Optional WorkOS bearer token. When provided the helper injects the header.
   */
  readonly token?: string;
}

const normalizePath = (path: string): string => path.replace(/^\//, "");

export const getGnssBaseUrl = (): string => env.NEXT_PUBLIC_GNSS_API_URL;

/**
 * fetchJson wraps the GNSS API with base URL + WorkOS token wiring.
 */
export async function fetchGnssJson<T>(
  path: string,
  options: GnssRequestOptions = {},
): Promise<T> {
  const baseUrl = getGnssBaseUrl().replace(/\/$/, "");
  const target = path.startsWith("http")
    ? path
    : `${baseUrl}/${normalizePath(path)}`;

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(target, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(
      `GNSS request failed with status ${response.status}: ${await response.text()}`,
    );
  }

  return (await response.json()) as T;
}
