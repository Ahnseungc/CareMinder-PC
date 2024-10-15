import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "@utils/axios/axiosInstance";
import { NewWard } from "@models/ward";

const createWard = async (data: NewWard): Promise<void> => {
  return (await axiosInstance.post("wards/sign-up", data)).data;
};

export default function useCreateWard(): UseMutationResult<void, AxiosError, NewWard> {
  return useMutation({ mutationFn: createWard });
}
