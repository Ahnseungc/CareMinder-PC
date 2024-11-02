import axios, { InternalAxiosRequestConfig, AxiosHeaders } from "axios";
import Cookies from "js-cookie";
import { SEVER_URL } from "@/constants/baseUrl";

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
      const isAccessToken =
        Cookies.get("accessToken") !== undefined ||
        Cookies.get("accessTokenStaff") !== undefined ||
        Cookies.get("accessTokenAdmin") !== undefined;

      if (!isAccessToken) {
        return Promise.reject(error);
      }

      if (error.response.status === 401) {
        const res = await axios.post(`${SEVER_URL}/users/refresh-token`, {
          accessToekn: Cookies.get("accessToken"),
          refreshToken: Cookies.get("refreshToken"),
        });
        if (res.data === false) {
          return false;
        }
        Cookies.set("accessToken", res.data.accessToken);
        Cookies.set("refreshToken", res.data.refreshToken);
      }

      // refresh

      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    let token = "";
    const userState = localStorage.getItem("recoil-persist");

    // const userType = userStateObj.userState.type;
    let userType = "";
    if (userState) {
      const userStateObj = JSON.parse(userState as string);
      userType = userStateObj.userState.type;
    }

    switch (userType) {
      case "WARD":
        token = Cookies.get("accessTokenWard") as string;
        break;
      case "STAFF":
        token = Cookies.get("accessTokenStaff") as string;
        break;
      case "ADMIN":
        token = Cookies.get("accessTokenAdmin") as string;
        break;
      default:
        null;
    }

    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
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
