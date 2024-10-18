import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosResponse } from "axios";

export type StaffPatientRequestApiType = {
  getInprogress(): Promise<AxiosResponse>;
};

const PATH = "/staff-patient-requests";

const StaffPatientRequest: StaffPatientRequestApiType = {
  //현재 직원의 수락중인 환자의 요청 조회
  getInprogress() {
    return axiosInstance.get(PATH + "/in-progress");
  },
};
export default StaffPatientRequest;
