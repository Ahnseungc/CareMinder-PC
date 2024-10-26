import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NewAdminRequests } from "@models/user";
import axiosInstance from "@utils/axios/axiosInstance";

const createAdmin = async (data: NewAdminUserRequests): Promise<void> => {
  // Axios 요청을 보내고, config를 포함
  const response = await axiosInstance.post("/admins/sign-up", data);
  return response.data;
};

export default function useCreateAdmin(): UseMutationResult<void, AxiosError, NewAdminRequests> {
  return useMutation({ mutationFn: createAdmin });
}
