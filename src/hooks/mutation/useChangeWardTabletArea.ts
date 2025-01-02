import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance, { CustomAxiosRequestConfig } from "@utils/axios/axiosInstance";
import Cookies from "js-cookie";

export type NewTabletfArea = {
  userIds: number[];
  areaId: number;
};

export type useChangeTabletAreaProps = {
  type: string;
};

const changeTabletArea = async (newTabletArea: NewTabletfArea) => {
  const res = await axiosInstance.post("/wards/change-tablet-area", newTabletArea);
  return res.data;
};
const changeTabletAreaStaff = async (newTabletArea: NewTabletfArea) => {
  const res = await axiosInstance.post("/wards/change-tablet-area", newTabletArea, {
    headers: { Authorization: `Bearer ${Cookies.get("accessTokenWard")}` },
    customHeader: true,
  } as CustomAxiosRequestConfig);
  return res.data;
};

export default function useChangeTabletArea({ type }: useChangeTabletAreaProps) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: type === "WARD" ? changeTabletArea : changeTabletAreaStaff,
    onSuccess: () => {
      console.log("구역 변경 완료");
      queryClient.invalidateQueries({ queryKey: ["ward-tablet-list", type] });
    },
    onError: error => {
      console.error("구역 변경 실패", error);
    },
  });
}
