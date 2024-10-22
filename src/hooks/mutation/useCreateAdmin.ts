import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NewAdminRequests } from "@models/user";
import axiosInstance from "@utils/axios/axiosInstance";

const createAdmin = async (data: NewAdminRequests): Promise<void> => {
  return (await axiosInstance.post("/admins/sign-up", data)).data;
};

export default function useCreateAdmin(): UseMutationResult<void, AxiosError, NewAdminRequests> {
  return useMutation({ mutationFn: createAdmin });
}
