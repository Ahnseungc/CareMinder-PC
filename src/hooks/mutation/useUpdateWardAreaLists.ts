import { GetWardAreaListsResponse } from "@hooks/queries/useGetWardAreaLists";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

export type NewWardAreaListType = {
  wards: GetWardAreaListsResponse[];
};

const updateWardAreaLists = async (newWardAreaLists: NewWardAreaListType) => {
  const res = await axiosInstance.post("/admins/update-ward-area-list", newWardAreaLists);
  return res.data;
};

export default function useUpdateWardAreaLists() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateWardAreaLists,
    onSuccess: () => {
      console.log("구역 정보 변경 완료");
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
      queryClient.invalidateQueries({ queryKey: ["areaList"] });
      queryClient.invalidateQueries({ queryKey: ["ward-area-List"] });
    },
    onError: error => {
      console.error("구역 정보 변경 실패", error);
    },
  });
}
