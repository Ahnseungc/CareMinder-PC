import { WardPatientRequest } from "@libraries/axios";
import { useQuery } from "@tanstack/react-query";

const getWardPatientInProgress = async () => {
  const res = await WardPatientRequest.getInProgress();
  return res.data.data;
};

export default function useGetWardPatientInProgress() {
  const { data, isLoading } = useQuery({
    queryKey: ["useGetWardPatientInProgress"],
    queryFn: getWardPatientInProgress,
  });
  return { data, isLoading };
}
