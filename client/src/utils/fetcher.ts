import ky, { HTTPError } from "ky";
import nProgress from "nprogress";
import { toast } from "sonner";
import { BACKEND_API_URL, BASE_PATH } from "@/utils/constants";
import { d, e } from "@/components/utils/crypto";
import { getToken } from "./token";
import { getFingerprint } from "./fingerprint";

interface FetcherProps {
  path: string;
  shouldEncrypt?: boolean;
  shouldDecrypt?: boolean;
  shouldShowLoader?: boolean;
}

interface JsonResult {
  message: string;
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const gisHeaders = async () => ({
  fp: getFingerprint(),
  "allow-gis": "%?Y?_TYqc2QM7^p4t#>c",
  // ...(process.env.NODE_ENV === "production" && {
  //   Authorization: `Bearer ${getToken()}`,
  // }),
  // ...(process.env.NODE_ENV !== "production" && {
  //   "allow-gis": "%?Y?_TYqc2QM7^p4t#>c",
  // }),
});

export const fetchGis = async (url: string, kyOptions?: Parameters<typeof ky>[1]) =>
  ky.get(url, { headers: await gisHeaders() });

export const fetcher = async (
  {
    path,
    shouldEncrypt = true,
    shouldDecrypt = true,
    shouldShowLoader = true,
  }: FetcherProps,
  kyOptions?: Parameters<typeof ky>[1]
) => {
  // console.log("before request", path);
  if (shouldEncrypt && kyOptions?.json) {
    // console.log("json body", kyOptions.json);
    kyOptions.json = {
      data: await e(kyOptions.json as object),
    };
    // console.log("encrypted request body", kyOptions.json);
  }
  let json: JsonResult | undefined;
  try {
    if (shouldShowLoader) {
      nProgress.start();
    }
    json = await ky(BACKEND_API_URL + path, {
      method: kyOptions?.method ?? "POST",
      headers: {
        ...kyOptions?.headers,
        Authorization: `Bearer ${getToken()}`,
        fp: getFingerprint(),
      },
      timeout: 30000,
      ...kyOptions,
    }).json<JsonResult>();
  } catch (err) {
    // console.log("error in fetcher");
    // console.log(Object.entries(err));
    if (kyOptions?.signal?.aborted) {
      return null;
    }
    if (err instanceof HTTPError) {
      const { response } = err;
      if (response.status === 401) {
        localStorage.clear();
        sessionStorage.clear();
        // Router.push("/login/");
        window.open(`${BASE_PATH}/login`, "_self");
        return null;
      } else if (response.status >= 400 || response.status <= 500) {
        return await response.json();
      } else {
        return {};
      }
    } else if (err instanceof TypeError && err.message === "Failed to fetch") {
      toast.error(
        "Could not connect to server. Please check your internet connection and try again."
      );
      return {};
    }
  } finally {
    if (shouldShowLoader) {
      nProgress.done();
    }
  }
  if (!shouldDecrypt) {
    return json;
  }
  // console.log("received response");
  // console.log("json parsed response", json);
  const encJsonString = json?.message;
  // console.log("encJsonString", encJsonString);
  const decJsonString = await d(encJsonString!);
  // console.log("decJsonString", decJsonString);
  const decJson = JSON.parse(decJsonString);
  // console.log("decJson", decJson);
  return decJson;
};
