import axios, { AxiosInstance } from "axios";

import { AppError } from "@utils/AppError";
import {
  storageAuthTokenGet,
  storageAuthTokenSave,
} from "@storage/storageAuthToken";
import {
  storageAuthRefreshTokenGet,
  storageAuthRefreshTokenSave,
} from "@storage/storageAuthRefreshToken";

type PromiseType = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
};

type ProcessQueueParams = {
  error: Error | null;
  token: string | null;
};

type RegisterIntercepetTokenManagerProps = {
  signOut: () => void;
  refreshTokenUpdated: (newToken: string) => void;
};

type ApiInstanceProps = AxiosInstance & {
  registerIntercepetTokenManager: ({}: RegisterIntercepetTokenManagerProps) => () => void;
};

const api = axios.create({
  baseURL: "http://191.252.109.114:3333/api",//"http://192.168.15.46:3333/api",
  //baseURL: "http://192.168.15.46:3333/api",
}) as ApiInstanceProps;

let isRefreshing = false;
let failedQueue: Array<PromiseType> = [];

const processQueue = ({ error, token = null }: ProcessQueueParams): void => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(token);
    }
  });

  failedQueue = [];
};

api.registerIntercepetTokenManager = ({ signOut, refreshTokenUpdated }) => {
  const intercepetTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError?.response?.status === 401) {
        if (
          requestError.response.data?.code === "token.expired" ||
          requestError.response.data?.code === "token.invalid"
        ) {

          const refreshToken = await storageAuthRefreshTokenGet();

          if (!refreshToken) {
            signOut();
            return Promise.reject(requestError);
          }

          const originalRequest = requestError.config;

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;

                return axios(originalRequest);
              })
              .catch((error) => {
                throw error;
              });
          }

          isRefreshing = true;

          return new Promise(async (resolve, reject) => {
            try {
              const { data } = await api.post("/auth/refresh", {
                refreshToken,
              });
              await storageAuthTokenSave(data.token);
              await storageAuthRefreshTokenSave(data.refreshToken);

              api.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${data.token}`;

              originalRequest.headers["Authorization"] = `Bearer ${data.token}`;

              refreshTokenUpdated(data.token);
              processQueue({ error: null, token: data.token });
              resolve(originalRequest);
              //
            } catch (error: any) {
              processQueue({ error, token: null });
              signOut();
              reject(error);
            } finally {
              isRefreshing = false;
            }
          });
        }

        signOut();
      }

      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message));
      } else {
        return Promise.reject(requestError);
      }
    }
  );

  return () => {
    api.interceptors.response.eject(intercepetTokenManager);
  };
};

export { api };
