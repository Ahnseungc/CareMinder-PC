import { StaffPatientRequest } from "@libraries/axios";
import { useQuery } from "@tanstack/react-query";

const getStaffPatientInprogress = async () => {
  const res = await StaffPatientRequest.getInprogress();
  return res.data.data;
};

export default function useGetStaffPatientInprogress(staffAcceptIsGroup: boolean) {
  const { data, isLoading } = useQuery({
    queryKey: ["useGetStaffPatientInprogress"],
    queryFn: getStaffPatientInprogress,
    enabled: !staffAcceptIsGroup,
  });
  return { data, isLoading };
}
