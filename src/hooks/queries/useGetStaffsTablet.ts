import StaffTabletRequest from "@libraries/axios/staffTabletRequest";
import { useQuery } from "@tanstack/react-query";

const getStaffsTabletRequests = async () => {
  const res = await StaffTabletRequest.getStaffTabletRequests();
  return res.data.data;
};

export default function useGetWardTabletRequests() {
  const { data, isLoading } = useQuery({
    queryKey: ["useGetStaffTabletRequests"],
    queryFn: getStaffsTabletRequests,
  });
  return { data, isLoading };
}
