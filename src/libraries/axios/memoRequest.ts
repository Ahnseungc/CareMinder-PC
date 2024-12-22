import { PostMemoType } from "@hooks/mutation/usePostMemo";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosResponse } from "axios";

export type MemoRequestApiType = {
  getMemo(patientId: number): Promise<AxiosResponse>;
  postMemo(data: PostMemoType): Promise<AxiosResponse>;
};

const PATH = "/memo/patient";

const MemoRequest: MemoRequestApiType = {
  getMemo(patientId: number) {
    return axiosInstance.get(PATH + "/" + patientId);
  },
  postMemo(data: PostMemoType) {
    return axiosInstance.post(PATH, data);
  },
};
export default MemoRequest;
