import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NewAdminUserRequests } from "@models/user";
import axios from "axios";
import { SEVER_URL } from "@constants/baseUrl";

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
