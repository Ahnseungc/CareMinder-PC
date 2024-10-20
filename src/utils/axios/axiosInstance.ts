import axios, { InternalAxiosRequestConfig, AxiosHeaders } from "axios";
import Cookies from "js-cookie";
import { SEVER_URL } from "@/constants/baseUrl";
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
    if (error.response.status === 401) {
      const isAccessToken = Cookies.get("accessToekn") !== undefined;

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
  (config: InternalAxiosRequestConfig<any>) => {
    const userType: UserType | undefined = (config as any).userType;
    let token = "";

    switch (userType) {
      case "main":
        token = Cookies.get("accessToken") as string;
        break;
      case "staff":
        token = Cookies.get("accessTokenStaff") as string;
        break;
      case "admin":
        token = Cookies.get("accessTokenAdmin") as string;
        break;
    }

    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }

      // 4. Authorization 헤더에 토큰 설정
      (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);

      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
