import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosError } from "axios";
import { Areas } from "./useGetStaffList";

export type GetStaffInfoResponse = {
  staffId: number;
  staffName: string;
  wardId: number;
  waraName: string;
  loginId: string;
  phoneNumber: string;
  email: string;
  nfc: string;
  fingerprint: string;
  staffRole: string;
  areas: Areas[];
};

export const getStaffInfo = async () => {
  const res = await axiosInstance.get("/staffs/info");
  return res.data;
};

const useGetStaffInfo = (): UseQueryResult<GetStaffInfoResponse, AxiosError> => {
  return useQuery<GetStaffInfoResponse, AxiosError>({
    queryKey: ["staffInfo"],
    queryFn: getStaffInfo,
  });
};

export default useGetStaffInfo;
