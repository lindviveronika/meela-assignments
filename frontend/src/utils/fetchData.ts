import type z from "zod";
import type { FetchResult } from "../types";

export async function fetchData<T>(
  url: string,
  schema: z.ZodType<T>,
  options?: RequestInit,
): Promise<FetchResult<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...options?.headers },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data = await response.json();

    const parseResult = schema.safeParse(data);
    if (!parseResult.success) {
      throw new Error(parseResult.error.message);
    }
    return { data: parseResult.data, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error : new Error("An unknown error occurred"),
    };
  }
}
