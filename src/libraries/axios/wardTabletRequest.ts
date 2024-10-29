import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosResponse } from "axios";

export type NoticeRequestApiType = {
  getWardTabletRequests(): Promise<AxiosResponse>;
  // getNoticeRequestsStatus(status: NoticeType): Promise<AxiosResponse>;
};

const PATH = "/staffs/tablet-list";

const WardTabletRequest: NoticeRequestApiType = {
  //모든 환자 요청 조회
  getWardTabletRequests() {
    return axiosInstance.get(PATH);
  },
};
export default WardTabletRequest;
