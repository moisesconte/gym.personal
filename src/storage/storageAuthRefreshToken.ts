import AsyncStorage from "@react-native-async-storage/async-storage";

import { AUTH_REFRESH_TOKEN_STORAGE } from "./storageConfig";

export async function storageAuthRefreshTokenSave(refreshToken: string) {
  await AsyncStorage.setItem(AUTH_REFRESH_TOKEN_STORAGE, refreshToken);
}

export async function storageAuthRefreshTokenGet() {
  const refreshToken = await AsyncStorage.getItem(AUTH_REFRESH_TOKEN_STORAGE);

  return refreshToken;
}

export async function storageAuthRefreshTokenRemove() {
  await AsyncStorage.removeItem(AUTH_REFRESH_TOKEN_STORAGE);
}
