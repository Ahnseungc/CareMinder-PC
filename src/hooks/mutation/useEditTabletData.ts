import { useMutation } from "@tanstack/react-query";
import axiosInstance, { CustomAxiosRequestConfig } from "@utils/axios/axiosInstance";
import Cookies from "js-cookie";

export type TabletInfo = {
  tabletIds: number[];
  areaId?: number;
  tabletName?: string;
  patientName?: string;
};

const editTabletData = async (newTabletInfo: TabletInfo) => {
  const res = await axiosInstance.put("/tablets/list", newTabletInfo, {
    headers: { Authorization: `Bearer ${Cookies.get("accessTokenWard")}` },
    customHeader: true,
  } as CustomAxiosRequestConfig);
  return res.data;
};

export default function useEditTabletData() {
  return useMutation({
    mutationFn: editTabletData,
  });
}
