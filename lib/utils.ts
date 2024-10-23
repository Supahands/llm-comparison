/* eslint-disable react-hooks/rules-of-hooks */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios, { AxiosRequestConfig } from "axios";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

export const useApi = (
  url: string,
  skip: boolean,
  method: "get" | "post" | "put" | "delete" = "get",
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

    if (skip) {
      setResult(undefined);
      setLoading(false);
      setLoaded(false);
    } else {
      setLoading(true);

      const axiosConfig: AxiosRequestConfig = { method, url, ...options };

      if (method === "post" || method === "put") {
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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
