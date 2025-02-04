import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NewAdminUserRequests } from "@models/user";
import axios from "axios";

const SEVER_URL = import.meta.env.VITE_SEVER_URL;

const createAdmin = async (data: NewAdminUserRequests): Promise<void> => {
  const response = await axios.post(`${SEVER_URL}/admins/sign-up`, data);
  return response.data;
};

export default function useCreateAdmin(): UseMutationResult<
  void,
  AxiosError,
  NewAdminUserRequests
> {
  return useMutation({ mutationFn: createAdmin });
}
