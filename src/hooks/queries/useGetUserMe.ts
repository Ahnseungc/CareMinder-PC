import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

const PATH = "/users/me";

const getUserMe = async () => {
  const res = await axiosInstance.get(PATH);
  console.log(res);
  return res.data;
};

export default function useGetUserMe() {
  const { data } = useQuery({
    queryKey: ["useGetUserMe"],
    queryFn: () => getUserMe(),
  });
  return { data };
}
