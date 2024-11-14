import { StaffPatientRequest } from "@libraries/axios";
import { staffGroup } from "@models/staff";
import { useQuery } from "@tanstack/react-query";

const getStaffPatientInprogressGroup = async () => {
  const res = await StaffPatientRequest.getInprogressGroup();
  return res.data.data;
};

export default function useGetStaffPatientInprogressGroup(staffAcceptIsGroup: boolean) {
  const { data, isLoading, refetch } = useQuery<staffGroup[], boolean>({
    queryKey: ["useGetStaffPatientInprogressGroup"],
    queryFn: getStaffPatientInprogressGroup,
    enabled: staffAcceptIsGroup,
  });
  return { data, isLoading, refetch };
}
