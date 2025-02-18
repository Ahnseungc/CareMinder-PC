import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

export type TableStatus = "FULL_ACCESS" | "REQUEST_ONLY" | "FORCE_TERMINATE" | null;

export type SleepModeSimple = {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  type: TableStatus;
};

export type WardTabledListType = {
  areaId: number;
  areaName: string;
  tabletId: number;
  tabletName: string;
  serialNumber: string;
  patientId: number;
  patientName: string;
  admissionAt: string;
  featureRestrictionType: TableStatus;
  sleepModeSimple: SleepModeSimple;
};

export type GetWardTabletListResponse = {
  data: WardTabledListType[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type GetWardTabletListProps = {
  patientName: string;
  myArea: boolean;
  page: number;
  size: number;
};

export const getWardTabledList = async ({
  patientName = "",
  myArea = false,
  page,
  size,
}: GetWardTabletListProps) => {
  const res = await axiosInstance.get("/wards/tablet-list", {
    headers: {
      Authorization: `Bearer ${Cookies.get("accessTokenWard")}`,
    },
    params: {
      patientName: patientName,
      myArea: myArea,
      page: page,
      size: size,
    },
  });
  return res.data;
};

export const useGetWardTabletList = ({
  patientName = "",
  myArea = false,
  page,
  size,
}: GetWardTabletListProps): UseQueryResult<GetWardTabletListResponse, AxiosError> => {
  return useQuery<GetWardTabletListResponse, AxiosError>({
    queryKey: ["ward-tablet-list", page, patientName],
    queryFn: () => getWardTabledList({ patientName, myArea, page, size }),
  });
};
