import { PatientStatus } from "@models/home";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosResponse } from "axios";

export type PatientRequestApiType = {
  getPatientRequests(): Promise<AxiosResponse>;
  getPatientRequestsStatus(status: PatientStatus): Promise<AxiosResponse>;
};

const PATH = "/patient-requests";

const PatientRequest: PatientRequestApiType = {
  //모든 환자 요청 조회
  getPatientRequests() {
    return axiosInstance.get(PATH);
  },

  //요청 상태별 환자 요청 조회
  getPatientRequestsStatus(status) {
    return axiosInstance.get(PATH + "/request-state", {
      params: {
        status,
      },
    });
  },
};
export default PatientRequest;
