import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "@utils/axios/axiosInstance";
import { NoticeReqType } from "@models/notice";

const createNotice = async (notice: NoticeReqType): Promise<void> => {
  return (await axiosInstance.post("/notices", notice)).data;
};

export default function useCreateNotice(): UseMutationResult<void, AxiosError, NoticeReqType> {
  return useMutation({ mutationFn: createNotice });
}
