import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosError } from "axios";

export type Areas = {
  areaId: number;
  areaName: string;
};

export type StaffListType = {
  staffId: number;
  name: string;
  loginId: string;
  phoneNumber: string;
  email: string;
  nfc: string;
  fingerprint: string;
  staffRole: string;
  areas: Areas[];
  timeSinceLogout: string | null;
  accountLocked: boolean;
  isLogIn: boolean;
};

export type GetStaffListResponse = {
  data: StaffListType[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type GetStaffListProps = {
  page: number;
  size: number;
};

export const getStaffList = async ({ page, size }: GetStaffListProps) => {
  const res = await axiosInstance.get("/wards/staff-list", {
    params: {
      page: page,
      size: size,
    },
  });
  // console.log(res.data);
  return res.data;
};

export const useGetStaffList = ({
  page,
  size,
}: GetStaffListProps): UseQueryResult<GetStaffListResponse, AxiosError> => {
  return useQuery<GetStaffListResponse, AxiosError>({
    queryKey: ["staffList", page],
    queryFn: () => getStaffList({ page, size }),
  });
};
