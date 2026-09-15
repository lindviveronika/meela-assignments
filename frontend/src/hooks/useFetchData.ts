import { useEffect, useState } from "react";
import { fetchData } from "../utils/fetchData";

export function useFetchData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    const loadDataFromApi = async () => {
      setIsLoading(true);

      const result = await fetchData<T>(url, {
        signal: abortController.signal,
      });

      if (abortController.signal.aborted) {
        return;
      }

      if (result.error) {
        setError(result.error);
        setData(null);
        setIsLoading(false);
        return;
      }

      setError(null);
      setData(result.data);
      setIsLoading(false);
    };

    loadDataFromApi();

    return () => {
      abortController.abort();
    };
  }, [url]);

  return { data, error, isLoading };
}
