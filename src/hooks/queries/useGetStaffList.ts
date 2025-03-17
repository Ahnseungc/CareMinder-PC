import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

export type Areas = {
  areaId: number;
  areaName: string;
  memo: string;
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
  areaFilter: number[];
  staffRoleFilter: string[];
};

export const getStaffList = async ({
  page,
  size,
  areaFilter,
  staffRoleFilter,
}: GetStaffListProps) => {
  const res = await axiosInstance.get("/wards/staff-list", {
    headers: {
      Authorization: `Bearer ${Cookies.get("accessTokenWard")}`,
    },
    params: {
      page,
      size,
      areaFilter,
      staffRoleFilter,
    },
    paramsSerializer: {
      indexes: null,
    },
  });
  return res.data;
};

export const useGetStaffList = ({
  page,
  size,
  areaFilter,
  staffRoleFilter,
}: GetStaffListProps): UseQueryResult<GetStaffListResponse, AxiosError> => {
  return useQuery<GetStaffListResponse, AxiosError>({
    queryKey: ["staffList", page],
    queryFn: () => getStaffList({ page, size, areaFilter, staffRoleFilter }),
  });
};
