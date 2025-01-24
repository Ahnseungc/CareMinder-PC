import SearchBox from "@components/common/SearachBox/SearchBox";
import SignOutButton from "./SignOutButton";
import { Box, styled, Typography } from "@mui/material";
import { ReactComponent as Logo } from "@assets/full-logo.svg";
import { useEffect } from "react";
// import { handleAllowNotification } from "@components/fcm/notificationPermission";
import Alarm from "@components/alarm/alarm.tsx";
import axiosInstance from "@utils/axios/axiosInstance";

export default function UserHeader() {
  // useEffect(() => {
  //   const registerServiceWorker = async ()b => {
  //     if (document.readyState === "complete" || document.readyState === "interactive") {
  //       await handleAllowNotification();
  //     } else {
  //       window.addEventListener("load", async () => {
  //         await handleAllowNotification();
  //       });
  //     }
  //   };

  //   registerServiceWorker();
  // }, []);
  useEffect(() => {
    const getData = async () => {
      const key = "get-fcm";
      //@ts-ignore
      const token = await window.Fcm.getFcmData(key);
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
