import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosResponse } from "axios";

export type WardPatientRequestApiType = {
  getPending(): Promise<AxiosResponse>;
  getInProgress(): Promise<AxiosResponse>;
};

const PATH = "/ward-patient-requests";

const WardPatientRequest: WardPatientRequestApiType = {
  //현재 병동에서 대기중인 환자 요청 조회
  getPending() {
    return axiosInstance.get(PATH + "/pending", { params: { aiRole: null } });
  },

  //현재 병동의 직원들이 수락 중인 환자의 요청 조회
  getInProgress() {
    return axiosInstance.get(PATH + "/in-progress");
  },
};
export default WardPatientRequest;
