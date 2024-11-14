import { StaffPatientRequest } from "@libraries/axios";
import { useQuery } from "@tanstack/react-query";

const getCompletedGroup = async (myArea: boolean) => {
  const res = await StaffPatientRequest.getCompletedGroup(myArea);
  return res.data.data;
};

export default function useGetCompletedGroup(myArea: boolean) {
  const { data, isLoading } = useQuery<any[], boolean>({
    queryKey: ["useGetCompletedGroup"],
    queryFn: () => getCompletedGroup(myArea),
    enabled: myArea,
  });
  return { data, isLoading };
}
