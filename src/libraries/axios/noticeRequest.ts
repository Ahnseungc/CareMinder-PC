import { NoticeType } from "@models/notice";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosResponse } from "axios";

export type NoticeRequestApiType = {
  getNoticeRequests(): Promise<AxiosResponse>;
  // getNoticeRequestsStatus(status: NoticeType): Promise<AxiosResponse>;
};

const PATH = "/notices";

const NoticeRequest: NoticeRequestApiType = {
  //모든 환자 요청 조회
  getNoticeRequests() {
    return axiosInstance.get(PATH);
  },
};
export default NoticeRequest;
