import StaffTabletRequest from "@libraries/axios/staffTabletRequest";
import { reqWardParamsType } from "@models/ward-tablet";
import { useQuery } from "@tanstack/react-query";

const getStaffsTabletRequests = async ({ token, patientName, myArea, page }: reqWardParamsType) => {
  const res = await StaffTabletRequest.getStaffTabletRequests({
    token,
    patientName,
    myArea,
    page,
  });
  return res.data;
};

export default function useGetWardTabletRequests({
  token,
  patientName,
  myArea,
  page,
}: reqWardParamsType) {
  const { data, refetch } = useQuery({
    queryKey: ["useGetStaffTabletRequests", token, patientName, myArea, page],
    queryFn: () => getStaffsTabletRequests({ token, patientName, myArea, page }),
  });
  return { data, refetch };
}
