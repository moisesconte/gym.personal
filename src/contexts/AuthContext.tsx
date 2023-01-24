import { createContext, ReactNode, useEffect, useState } from "react";
import md5 from "md5";
import crypto from "react-native-crypto-js";

import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from "@storage/storageAuthToken";
import {
  storageAuthRefreshTokenRemove,
  storageAuthRefreshTokenSave,
} from "@storage/storageAuthRefreshToken";
import {
  storageUserSave,
  storageUserGet,
  storageUserRemove,
} from "@storage/storageUser";

import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";

const algorithm = "aes-256-ctr";
const secretKey = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";

type Hash = {
  iv: string;
  content: string;
};

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (login: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateAvatar: (userId: string, avatarUploadForm: FormData) => Promise<any>;
  updatePassword: (password: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  isLoadingUserStorageData: boolean;
  refreshedToken: string;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(true);
  const [refreshedToken, setRefreshedToken] = useState("");

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  }

  async function storageUserAndTokenSave(
    userData: UserDTO,
    token: string,
    refreshToken: string
  ) {
    try {
      setIsLoadingUserStorageData(true);
      await storageUserSave(userData);
      await storageAuthTokenSave(token);
      await storageAuthRefreshTokenSave(refreshToken);
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signIn(login: string, password: string) {
    try {
      const { data } = await api.post("/auth/sessions", {
        login,
        password: crypto.AES.encrypt(password, secretKey).toString(), //md5(password),
      });

      if (data.user && data.token && data.refreshToken) {
        const { user, token, refreshToken } = data;
        storageUserAndTokenSave(user, token, refreshToken);
        userAndTokenUpdate(user, token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true);
      setUser({} as UserDTO);

      await storageUserRemove();
      await storageAuthTokenRemove();
      await storageAuthRefreshTokenRemove();
      //
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true);
      const userLogged = await storageUserGet();
      const token = await storageAuthTokenGet();

      if (token && userLogged) {
        userAndTokenUpdate(userLogged, token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function updateAvatar(userId: string, avatarUploadForm: FormData) {
    try {
      const { data } = await api.patch(
        `/user/avatar/${userId}`,
        avatarUploadForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { avatar_url } = data;

      storageUserSave({
        ...user,
        photo_url: avatar_url,
      });

      setUser({
        ...user,
        photo_url: avatar_url,
      });

      return avatar_url;
    } catch (error) {
      throw error;
    }
  }

  function refreshTokenUpdated(newToken: string) {
    setRefreshedToken(newToken);
  }

  async function updatePassword(password: string, newPassword: string) {
    try {
      const { data } = await api.post("/user/update-password", {
        password: crypto.AES.encrypt(password, secretKey).toString(), //md5(password),//password: md5(password),
        newPassword: crypto.AES.encrypt(newPassword, secretKey).toString(), //md5(newPassword),
      });
    } catch (error) {
      throw error;
    }
  }

  async function forgotPassword(email: string) {
    try {
      await api.post("/auth/forgot-password", { email });
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const subscribe = api.registerIntercepetTokenManager({
      signOut,
      refreshTokenUpdated,
    });

    return () => {
      subscribe();
    };
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        updateAvatar,
        updatePassword,
        forgotPassword,
        isLoadingUserStorageData,
        refreshedToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
