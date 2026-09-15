import type { FetchResult } from "../types";

export async function fetchData<T>(
  url: string,
  options?: RequestInit,
): Promise<FetchResult<T>> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data = await response.json();

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error : new Error("An unknown error occurred"),
    };
  }
}
