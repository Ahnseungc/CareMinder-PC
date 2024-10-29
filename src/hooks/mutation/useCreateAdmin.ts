import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NewAdminUserRequests } from "@models/user";
// import axiosInstance from "@utils/axios/axiosInstance";
import axios from "axios";
import { SEVER_URL } from "@constants/baseUrl";

const createAdmin = async (data: NewAdminUserRequests): Promise<void> => {
  // Axios 요청을 보내고, config를 포함
  // const response = await axiosInstance.post("/admins/sign-up", data);
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
