import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosResponse } from "axios";

export type StaffsRequestApiType = {
  getStaffTabletRequests(): Promise<AxiosResponse>;
  // getNoticeRequestsStatus(status: NoticeType): Promise<AxiosResponse>;
};

const PATH = "/staffs/tablet-list";

const StaffTabletRequest: StaffsRequestApiType = {
  //모든 환자 요청 조회
  getStaffTabletRequests() {
    return axiosInstance.get(PATH);
  },
};
export default StaffTabletRequest;
