import { PatientRequest } from "@libraries/axios";
import { useQuery } from "@tanstack/react-query";

const getPatientRequests = async () => {
  const res = await PatientRequest.getPatientRequests();
  return res.data.data;
};

export default function useGetPatientRequests() {
  const { data, isLoading } = useQuery({
    queryKey: ["useGetPatientRequests"],
    queryFn: getPatientRequests,
  });
  return { data, isLoading };
}
