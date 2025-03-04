import { SleepModeSimple, TableStatus } from "@hooks/queries/useGetWardTabletList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance, { CustomAxiosRequestConfig } from "@utils/axios/axiosInstance";
// import { tabletEvents } from "@utils/events";
import Cookies from "js-cookie";

export type TabletInfo = {
  tabletIds: number[];
  areaId: number;
  tabletName: string;
  patientName: string;
  featureRestrictionType: TableStatus;
  sleepModeSimple: SleepModeSimple | null;
  admissionDate: string;
};

const updateTabletInfo = async (newTabletInfo: TabletInfo) => {
  const res = await axiosInstance.put("/tablets/list", newTabletInfo, {
    headers: { Authorization: `Bearer ${Cookies.get("accessTokenWard")}` },
    customHeader: true,
  } as CustomAxiosRequestConfig);
  return res.data;
};

export default function useUpdateTabletInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTabletInfo,
    onSuccess: () => {
      console.log("태블릿 정보 변경 완료");
      queryClient.invalidateQueries({ queryKey: ["ward-tablet-list"] });
      // tabletEvents.notify();
    },
    onError: error => {
      console.error("태블릿 정보 변경 실패", error);
    },
  });
}
