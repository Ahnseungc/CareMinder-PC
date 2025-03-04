import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosResponse } from "axios";

export type MemoRequestApiType = {
  getPatientMemoRequest(patientId: number): Promise<AxiosResponse>;
};

const PATH = `/memo/patient`;

const MemoRequest: MemoRequestApiType = {
  //모든 환자 요청 조회
  getPatientMemoRequest(patientId: number) {
    return axiosInstance.get(`${PATH}/${patientId}`);
  },
};
export default MemoRequest;
