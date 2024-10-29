import axios, { AxiosRequestConfig } from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const useApi = (
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  skip: boolean = false,
  payload?: unknown,
  options?: AxiosRequestConfig
): [
  unknown,
  boolean,
  boolean,
  unknown,
  () => void,
  Dispatch<SetStateAction<unknown>>
] => {
  const [result, setResult] = useState<unknown>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(undefined);
  const [refreshIndex, setRefreshIndex] = useState<number>(0);

	const refresh = () => {
    setRefreshIndex((prev) => prev + 1);
  };

  useEffect(() => {
    let cancelled = false;
		console.log("skip", skip)
    if (skip) {
      setResult(undefined);
      setLoading(false);
      setLoaded(false);
    } else {
      setLoading(true);

      const axiosConfig: AxiosRequestConfig = { method, url, ...options };

      if (method === "POST" || method === "PUT") {
        axiosConfig.data = payload;
      }

      axios(axiosConfig)
        .then((r) => {
          if (!cancelled) {
            setResult(r.data);
            setLoading(false);
            setLoaded(true);
          }
        })
        .catch((error) => {
          setLoading(false);
          if (error.response) {
            setError(error.response.data);
          } else {
            setError(error.message);
          }
        });
    }

    return () => {
      cancelled = true;
    };
  }, [url, refreshIndex]);

  return [result, loading, loaded, error, refresh, setResult];
};
