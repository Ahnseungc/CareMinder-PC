import { reqWardParamsType } from "@models/ward-tablet";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosResponse } from "axios";

export type StaffsRequestApiType = {
  getStaffTabletRequests(params: reqWardParamsType): Promise<AxiosResponse>;
};

const PATH = "/staffs/patient-list";

const StaffTabletRequest: StaffsRequestApiType = {
  //모든 환자 요청 조회
  getStaffTabletRequests({ token, patientName, myArea, page }) {
    return axiosInstance.get(PATH, {
      params: {
        token,
        patientName,
        myArea,
        page,
      },
    });
  },
};
export default StaffTabletRequest;
