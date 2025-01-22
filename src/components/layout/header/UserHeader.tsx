import SearchBox from "@components/common/SearachBox/SearchBox";
import SignOutButton from "./SignOutButton";
import { Box, styled, Typography } from "@mui/material";
import { ReactComponent as Logo } from "@assets/full-logo.svg";
import { useEffect } from "react";
import { handleAllowNotification } from "@components/fcm/notificationPermission";
import Alarm from "@components/alarm/alarm.tsx";
import axiosInstance from "@utils/axios/axiosInstance";

export default function UserHeader() {
  useEffect(() => {
    //@ts-ignore
    if (typeof window.process === "object" && window.process.type === "browser") {
      console.log("This is an Electron environment");
      const getData = async () => {
        const key = "get-fcm";
        //@ts-ignore
        const token = await window.electron.getFcmData(key); // 프리로드를 통해 메인 프로세스와 통신
        console.log(`Retrieved data: ${key} = ${token}`);

        if (token) {
          const res = await axiosInstance.post(
            `/fcm/save`,
            {},
            {
              headers: {
                FcmToken: token,
              },
            },
          );
          console.log(res);
        }
      };
      getData();
    } else {
      console.log("This is a normal web browser");
      handleAllowNotification();
    }
  }, []);
  return (
    <>
      <Logo />
      <Typography>
        <HeaderContainer>
          <SearchBoxWrapper>
            <SearchBox />
          </SearchBoxWrapper>
          <SignOutButton />
        </HeaderContainer>
      </Typography>
      <Alarm />
    </>
  );
}

const HeaderContainer = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  gap: "20px",
});

const SearchBoxWrapper = styled(Box)({
  position: "relative",
  height: "36px",
});
