import WardTabletRequest from "@libraries/axios/wardTabletRequest";
import { useQuery } from "@tanstack/react-query";

const getWardTabletRequests = async () => {
  const res = await WardTabletRequest.getWardTabletRequests();
  return res.data.data;
};

export default function useGetWardTabletRequests() {
  const { data, isLoading } = useQuery({
    queryKey: ["useGetWardTabletRequests"],
    queryFn: getWardTabletRequests,
  });
  return { data, isLoading };
}
