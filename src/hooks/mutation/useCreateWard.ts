import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "@utils/axios/axiosInstance";
import { NewWardRequest } from "@models/ward";

const createWard = async (data: NewWardRequest): Promise<void> => {
  return (await axiosInstance.post("/wards/sign-up", data)).data;
};

export default function useCreateWard(): UseMutationResult<void, AxiosError, NewWardRequest> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wardList"] });
    },
    onError: error => console.error(error),
  });
}
