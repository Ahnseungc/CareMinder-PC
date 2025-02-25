import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosResponse } from "axios";

export type MemoRequestApiType = {
  getPatientMemoRequest(patientIds: number[]): Promise<AxiosResponse>;
};

const PATH = `/memo/patient`;

const MemoRequest: MemoRequestApiType = {
  //모든 환자 요청 조회
  getPatientMemoRequest(patientIds: number[]) {
    return axiosInstance.post(`${PATH}/get`, { patientIds });
  },
};
export default MemoRequest;
