import { StaffPatientRequest } from "@libraries/axios";
import { RequestsData } from "@models/home";
import { useQuery } from "@tanstack/react-query";

const getStaffPatientInprogressGroup = async () => {
  const res = await StaffPatientRequest.getInprogressGroup();
  return res.data.data;
};

export default function useGetStaffPatientInprogressGroup(staffAcceptIsGroup: boolean) {
  const { data, isLoading, refetch } = useQuery<RequestsData[], boolean>({
    queryKey: ["useGetStaffPatientInprogressGroup"],
    queryFn: getStaffPatientInprogressGroup,
    enabled: staffAcceptIsGroup,
  });
  return { data, isLoading, refetch };
}
