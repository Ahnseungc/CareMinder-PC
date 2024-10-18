import { WardPatientRequest } from "@libraries/axios";
import { useQuery } from "@tanstack/react-query";

const getWardPatientPending = async () => {
  const res = await WardPatientRequest.getPending();
  return res.data.data;
};

export default function useGetWardPatientPending() {
  const { data, isLoading } = useQuery({
    queryKey: ["useGetWardPatientPending"],
    queryFn: getWardPatientPending,
  });
  return { data, isLoading };
}
