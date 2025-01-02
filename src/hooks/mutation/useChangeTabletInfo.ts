import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance, { CustomAxiosRequestConfig } from "@utils/axios/axiosInstance";
import Cookies from "js-cookie";

export type tabletInfo = {
  tabletIds: Array<number>;
  areaId: number;
  tabletName: string;
  patientName: string;
};

const changeTabletInfo = async (tabletInfo: tabletInfo) => {
  const res = await axiosInstance.put("/tablets/list", tabletInfo, {
    headers: { Authorization: `Bearer ${Cookies.get("accessTokenWard")}` },
    customHeader: true,
  } as CustomAxiosRequestConfig);
  return res.data;
};

export default function useChangeTabletInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeTabletInfo,
    onSuccess: () => {
      console.log("정보 변경 완료");
      queryClient.invalidateQueries({ queryKey: ["tablet-info"] });
    },
    onError: error => {
      console.error("정보변경 실패", error);
    },
  });
}
