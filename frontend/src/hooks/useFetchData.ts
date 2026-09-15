import { useEffect, useState } from "react";
import { fetchData } from "../utils/fetchData";

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export function useFetchData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    const loadDataFromApi = async () => {
      setIsLoading(true);

      try {
        const result = await fetchData(url, {
          signal: abortController.signal,
        });

        if (abortController.signal.aborted) {
          return;
        }

        setData(result);
        setIsLoading(false);
      } catch (err) {
        if (abortController.signal.aborted) {
          return;
        }

        const error: Error = isError(err)
          ? err
          : new Error("An unknown error occurred");

        setError(error);
        setIsLoading(false);
      }
    };

    loadDataFromApi();

    return () => {
      abortController.abort();
    };
  }, [url]);

  return { data, error, isLoading };
}
