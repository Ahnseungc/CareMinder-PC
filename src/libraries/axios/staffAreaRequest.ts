import axiosInstance, { CustomAxiosRequestConfig } from "@utils/axios/axiosInstance";
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";

export type AreaRequestApiType = {
  getStaffAreaRequests(params: { token: string }): Promise<AxiosResponse>;
};

const PATH = "/areas";

const StaffAreaRequest: AreaRequestApiType = {
  //모든 환자 요청 조회
  getStaffAreaRequests({ token }) {
    return axiosInstance.get(PATH, {
      headers: { Authorization: `Bearer ${Cookies.get("accessTokenWard")}` },
      customHeader: true,
      params: {
        token,
      },
    } as CustomAxiosRequestConfig);
  },
};
export default StaffAreaRequest;
