import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "@utils/axios/axiosInstance";
import { NoticeType } from "@models/notice";

const createNotice = async (notice: NoticeType): Promise<void> => {
  return (await axiosInstance.post("/notices", notice)).data;
};

export default function useCreateNotice(): UseMutationResult<void, AxiosError, NoticeType> {
  return useMutation({ mutationFn: createNotice });
}
