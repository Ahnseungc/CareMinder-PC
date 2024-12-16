import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosError } from "axios";

export type WardTabledListType = {
  areaId: number;
  areaName: string;
  tabletId: number;
  tabletName: string;
  serialNumber: string;
  patientId: number;
  patientName: string;
  createdAt: string;
};

export type GetWardTabletListResponse = {
  data: WardTabledListType[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type GetWardTabletListProps = {
  myArea: boolean;
  page: number;
  size: number;
};

export const getWardTabledList = async ({ myArea = false, page, size }: GetWardTabletListProps) => {
  const res = await axiosInstance.get("/wards/tablet-list", {
    params: {
      myArea: myArea,
      page: page,
      size: size,
    },
  });
  return res.data;
};

export const useGetWardTabletList = ({
  myArea = false,
  page,
  size,
}: GetWardTabletListProps): UseQueryResult<GetWardTabletListResponse, AxiosError> => {
  return useQuery<GetWardTabletListResponse, AxiosError>({
    queryKey: ["ward-tablet-list", page],
    queryFn: () => getWardTabledList({ myArea, page, size }),
  });
};
