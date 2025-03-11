import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axiosInstance, { CustomAxiosRequestConfig } from "@utils/axios/axiosInstance";
import { tabletEvents } from "@utils/events";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useEffect } from "react";

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

export type Order = "ASC" | "DESC" | "DEFAULT";

export type TabletFilter = {
  areaFilter?: number[];
  patientNameFilter?: string;
  patientNameSort?: Order;
  tabletNameSort?: Order;
  admissionDateSort?: Order;
};

export type TabletListsProps = {
  page: number;
  size: number;
  filter?: TabletFilter;
};

const tabletLists = async ({ page, size, filter }: TabletListsProps) => {
  const res = await axiosInstance.post(`/wards/tablet-list?page=${page}&size=${size}`, filter, {
    customHeader: true,
    headers: {
      Authorization: `Bearer ${Cookies.get("accessTokenWard")}`,
    },
  } as CustomAxiosRequestConfig);
  return res.data as GetWardTabletListResponse;
};

export default function useTabletLists(): UseMutationResult<
  GetWardTabletListResponse,
  AxiosError,
  TabletListsProps
> {
  const mutation = useMutation<GetWardTabletListResponse, AxiosError, TabletListsProps>({
    mutationFn: tabletLists,
    onSuccess: () => {},
    onError: () => {},
  });

  useEffect(() => {
    const unsubscribe = tabletEvents.subscribe(() => {
      if (mutation.isSuccess && mutation.variables) {
        mutation.mutate(mutation.variables);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [mutation]);

  return mutation;
}
