import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";
import { selectedWardType } from "@models/ward-tablet";

const useDischargePatients = () => {
  return useMutation({
    mutationFn: (tabletIds: selectedWardType) => {
      return axiosInstance.post("/patients/discharge-by-web", tabletIds);
    },
  });
};

export default useDischargePatients;
