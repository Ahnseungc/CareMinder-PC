import { StaffPatientRequest } from "@libraries/axios";
import { useQuery } from "@tanstack/react-query";

const getStaffPatientInprogress = async () => {
  const res = await StaffPatientRequest.getInprogress();
  return res.data.data;
};

export default function useGetStaffPatientInprogress() {
  const { data, isLoading } = useQuery({
    queryKey: ["useGetStaffPatientInprogress"],
    queryFn: getStaffPatientInprogress,
  });
  return { data, isLoading };
}
