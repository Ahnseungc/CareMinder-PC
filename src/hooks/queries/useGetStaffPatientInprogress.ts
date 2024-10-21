import { StaffPatientRequest } from "@libraries/axios";
import { RequestsData } from "@models/home";
import { useQuery } from "@tanstack/react-query";

const getStaffPatientInprogress = async () => {
  const res = await StaffPatientRequest.getInprogress();
  return res.data.data;
};

export default function useGetStaffPatientInprogress(staffAcceptIsGroup: boolean) {
  const { data, isLoading, refetch } = useQuery<RequestsData[], boolean>({
    queryKey: ["useGetStaffPatientInprogress"],
    queryFn: getStaffPatientInprogress,
    enabled: !staffAcceptIsGroup,
  });
  return { data, isLoading, refetch };
}
