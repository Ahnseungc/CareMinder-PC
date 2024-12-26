import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "@utils/axios/axiosInstance";
import { NewStaffRequests } from "@models/staff";

const createStaff = async (data: NewStaffRequests): Promise<void> => {
  return (await axiosInstance.post("staffs/sign-up", data)).data;
};

export default function useCreateStaff(): UseMutationResult<void, AxiosError, NewStaffRequests> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
      queryClient.invalidateQueries({ queryKey: ["staffSimpleList"] });
    },
  });
}
