import { createContext, ReactNode } from "react";

import { useToast, IToastProps } from "native-base";
import { AppError } from "@utils/AppError";
import { isAxiosError } from "axios";

export type ToastContextProps = {
  handleError: (error: any) => void;
  showToast: (props: IToastProps) => void;
};

type ToastContextProviderProps = {
  children: ReactNode;
};

export const ToastContext = createContext<ToastContextProps>(
  {} as ToastContextProps
);

export function ToastContextProvider({ children }: ToastContextProviderProps) {
  const toast = useToast();

  function handleError(error: any) {
    const isAppError = error instanceof AppError;
    const axiosError = isAxiosError(error);

    if (isAppError) {
      const title = error.message;

      return toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }

    if (axiosError && error.response?.status !== 401) {
      const title = error.message;

      return toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }

    return toast.show({
      title: error?.message ?? "Erro inesperado, tente novamente mais tarde.",
      placement: "top",
      bgColor: "red.500",
    });
  }

  function showToast(props: IToastProps) {
    return toast.show({
      ...props,
    });
  }

  return (
    <ToastContext.Provider value={{ handleError, showToast }}>
      {children}
    </ToastContext.Provider>
  );
}
