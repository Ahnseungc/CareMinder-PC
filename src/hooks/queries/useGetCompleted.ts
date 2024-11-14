import { StaffPatientRequest } from "@libraries/axios";
import { RequestsData } from "@models/home";

import { useQuery } from "@tanstack/react-query";

const getCompleted = async (myArea: boolean) => {
  const res = await StaffPatientRequest.getCompleted(myArea);
  return res.data.data;
};

export default function useGetCompleted(myArea: boolean) {
  const { data, isLoading } = useQuery<RequestsData[], boolean>({
    queryKey: ["useGetCompleted", myArea],
    queryFn: () => getCompleted(myArea),
  });
  return { data, isLoading };
}
