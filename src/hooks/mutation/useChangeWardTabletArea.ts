import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

export type NewTabletfArea = {
  userIds: number[];
  areaId: number;
};

const changeTabletArea = async (newTabletArea: NewTabletfArea) => {
  const res = await axiosInstance.post("/wards/change-tablet-area", newTabletArea);
  return res.data;
};

export default function useChangeTabletArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeTabletArea,
    onSuccess: () => {
      console.log("구역 변경 완료");
      queryClient.invalidateQueries({ queryKey: ["ward-tablet-list"] });
    },
    onError: error => {
      console.error("구역 변경 실패", error);
    },
  });
}
