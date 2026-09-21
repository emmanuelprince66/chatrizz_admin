import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { ENDPOINTS } from "../endpoints";
import type { MessageResponse } from "../types";

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export const useChangePasswordMutation = () =>
  useMutation<MessageResponse, Error, ChangePasswordPayload>({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post<MessageResponse>(
        ENDPOINTS.auth.changePassword,
        payload,
      );
      return data;
    },
  });
