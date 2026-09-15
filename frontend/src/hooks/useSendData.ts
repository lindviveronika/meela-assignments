import { useCallback, useState } from "react";
import type z from "zod";
import type { FetchResult } from "../types";
import { fetchData } from "../utils/fetchData";

export function useSendData<T>(
  url: string,
  schema: z.ZodType<T>,
): {
  error: Error | null;
  isLoading: boolean;
  sendData: (options?: RequestInit) => Promise<FetchResult<T>>;
} {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendData = useCallback(
    async (options?: RequestInit): Promise<FetchResult<T>> => {
      setIsLoading(true);

      const result = await fetchData<T>(url, schema, options);

      setIsLoading(false);

      if (result.error) {
        console.error(result.error);
        setError(result.error);
        return { data: null, error: result.error };
      }

      setError(null);
      return { data: result.data, error: null };
    },
    [url, schema],
  );

  return { error, isLoading, sendData };
}
