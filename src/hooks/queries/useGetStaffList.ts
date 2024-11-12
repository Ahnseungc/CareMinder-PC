import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosError } from "axios";

export type StaffListType = {
  staffId: number;
  name: string;
  loginId: string;
  phoneNumber: string;
  email: string;
  nfc: string;
  fingerprint: string;
  staffRole: string;
  accountLocked: boolean;
  isLogin: boolean;
  timeSinceLogout: string | null;
  areaId: number;
  areaName: string;
};

export type GetStaffListResponse = {
  data: StaffListType[];
};

export const getStaffList = async () => {
  const res = await axiosInstance.get("/wards/staff-list");
  console.log(res.data);
  return res.data;
};

export const useGetStaffList = (): UseQueryResult<GetStaffListResponse, AxiosError> => {
  return useQuery<GetStaffListResponse, AxiosError>({
    queryKey: ["staffList"],
    queryFn: getStaffList,
  });
};
