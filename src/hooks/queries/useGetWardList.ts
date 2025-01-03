import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

export type WardListType = {
  wardId: number;
  wardName: string;
  loginId: string;
  managerName: string | null;
  managerPhoneNumber: string;
  managerEmail: string;
  userStatusInfo: {
    accountLocked: boolean;
    isLogIn: boolean;
    timeSinceLogout: string | null;
  };
};

export type GetWardListResponse = {
  data: WardListType[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type GetWardListProps = {
  page: number;
  size: number;
};

export const getWardList = async ({ page, size }: GetWardListProps) => {
  const res = await axiosInstance.get("/admins/ward-list", {
    headers: {
      Authorization: `Bearer ${Cookies.get("accessTokenAdmin")}`,
    },
    params: {
      page: page,
      size: size,
    },
  });
  return res.data;
};

export const useGetwardList = ({
  page,
  size,
}: GetWardListProps): UseQueryResult<GetWardListResponse, AxiosError> => {
  return useQuery<GetWardListResponse, AxiosError>({
    queryKey: ["wardList", page],
    queryFn: () => getWardList({ page, size }),
  });
};
