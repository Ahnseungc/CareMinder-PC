import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosResponse } from "axios";

export type NoticeRequestDetailApiType = {
  getNoticeDetailRequests(id: number): Promise<AxiosResponse>;
  // getNoticeRequestsStatus(status: NoticeType): Promise<AxiosResponse>;
};

const PATH = "/notices";

const NoticeDetailRequest: NoticeRequestDetailApiType = {
  //모든 환자 요청 조회
  getNoticeDetailRequests(id: number) {
    return axiosInstance.get(`${PATH}/${id}`);
  },
};
export default NoticeDetailRequest;
