import { PostMemoType } from "@hooks/mutation/usePostMemo";
import { PutMemoType } from "@hooks/mutation/usePutMemo";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosResponse } from "axios";

export type MemoRequestApiType = {
  getMemo(patientId: number): Promise<AxiosResponse>;
  postMemo(data: PostMemoType): Promise<AxiosResponse>;
  deleteMemo(memoId: number): Promise<AxiosResponse>;
  putMemo(data: PutMemoType): Promise<AxiosResponse>;
};

const PATH = "/memo/patient";

const MemoRequest: MemoRequestApiType = {
  getMemo(patientId: number) {
    return axiosInstance.get(PATH + "/" + patientId);
  },
  postMemo(data: PostMemoType) {
    return axiosInstance.post(PATH, data);
  },
  deleteMemo(memoId: number) {
    return axiosInstance.delete(PATH + "/" + memoId);
  },
  putMemo(data: PutMemoType) {
    return axiosInstance.put(PATH + "/" + data.memoId, data.changeMemo);
  },
};
export default MemoRequest;
