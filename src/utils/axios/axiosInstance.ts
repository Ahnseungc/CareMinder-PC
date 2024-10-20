import axios from "axios";
import Cookies from "js-cookie";
import { SEVER_URL } from "@/constants/baseUrl";
import { useRecoilValue } from "recoil";
import { userState } from "@libraries/recoil";
import { UserType } from "@models/user";

const axiosInstance = axios.create({
  baseURL: SEVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//토큰 유효성 검사
axiosInstance.interceptors.response.use(
  res => {
    return res;
  },
  async error => {
    const user = useRecoilValue(userState);
    let accessToken = "";
    switch (user as unknown as UserType) {
      case "main":
        accessToken = Cookies.get("accessToken") as string;
        break;

      case "staff":
        accessToken = Cookies.get("accessTokenStaff") as string;
        break;

      case "admin":
        accessToken = Cookies.get("accessTokenAdmin") as string;
        break;
    }

    if (error.response.status === 401) {
      const isAccessToken = accessToken !== "";

      if (!isAccessToken) {
        return Promise.reject(error);
      }

      // refresh
      //   const res = await axios.post(`${SEVER_URL}/refresh`, {
      //     accessToekn: Cookies.get("accessToken"),
      //     refreshToken: Cookies.get("refreshToken"),
      //   });
      //   if (res.data === false) {
      //     return false;
      //   }
      //   Cookies.set("accessToken", res.data.accessToken);
      //   Cookies.set("refreshToken", res.data.refreshToken);

      //   return Promise.reject(error);
    }
  },
);

axiosInstance.interceptors.request.use(
  config => {
    const user = useRecoilValue(userState);
    let accessToken = "";
    switch (user as unknown as UserType) {
      case "main":
        accessToken = Cookies.get("accessToken") as string;
        break;

      case "staff":
        accessToken = Cookies.get("accessTokenStaff") as string;
        break;

      case "admin":
        accessToken = Cookies.get("accessTokenAdmin") as string;
        break;
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
