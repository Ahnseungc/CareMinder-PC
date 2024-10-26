import { PatientStatus, isRoleType } from "@models/home";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosResponse } from "axios";

type PendingType = {
  aiRole: isRoleType;
  myArea: boolean;
};

export type StaffPatientRequestApiType = {
  getPending(params: PendingType): Promise<AxiosResponse>;
  getInprogress(): Promise<AxiosResponse>;
  getInprogressGroup(): Promise<AxiosResponse>;
  postAccept(id: number): Promise<AxiosResponse>;
  patchComplete(id: number): Promise<AxiosResponse>;
  patchDecline(id: number): Promise<AxiosResponse>;
};

const PATH = "/staff-patient-requests";

const StaffPatientRequest: StaffPatientRequestApiType = {
  //현재 직원의 대기중인 환자의 요청 조회
  getPending({ aiRole, myArea }) {
    return axiosInstance.get(PATH + "/pending", { params: { aiRole, myArea } });
  },

  //현재 직원의 수락중인 환자의 요청 조회
  getInprogress() {
    return axiosInstance.get(PATH + "/in-progress");
  },

  //현재 직원의 수락중인 환자의 요청 조회(환자별 묶기)
  getInprogressGroup() {
    return axiosInstance.get(PATH + "/in-progress/patient-group");
  },

  //환자 요청 수락
  postAccept(id) {
    return axiosInstance.post(PATH + "/accept", { patientRequestId: id });
  },

  //환자 요청 상태 완료 처리
  patchComplete(id) {
    return axiosInstance.patch(PATH + "/state", { patientRequestId: id });
  },

  //환자 요청 상태 처리 취소
  patchDecline(id) {
    return axiosInstance.patch(PATH + "/state", { patientRequestId: id });
  },
};
export default StaffPatientRequest;
