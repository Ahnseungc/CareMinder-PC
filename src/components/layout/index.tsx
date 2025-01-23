import Sidebar from "./sidebar";
import Header from "./header";

import { Box, Stack, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { userState } from "@libraries/recoil";
import { useNavigate } from "react-router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import RoutePath from "@routes/routePath";
import { useBooleanState, useCallbackOnce } from "@toss/react";
import InnerContainer from "./inner/InnerContainer";
import StaffSigninModal from "@components/signin/staff/StaffSigninModal";
import modalState from "@libraries/recoil/modal";
import { useAutoLogout } from "@utils/useAutoLogout";
import InfoModal from "@components/settings/modal/InfoModal";
import AutoLogoutMessage from "@components/common/AutoLogout/AutoLogoutMessage";
import Cookies from "js-cookie";

export default function AuthenticatedLayout() {
  const navigate = useNavigate();

  // const user = useRecoilValue(userState);
  //@ts-ignore
  const [user, setUser] = useState<any>();
  // const setUser = useSetRecoilState(userState);
  const isModal = useRecoilValue(modalState);
  const setIsModalOpen = useSetRecoilState(modalState);
  const userType = useRecoilValue(userState)?.type;
  const accessTokenWard = Cookies.get("accessTokenWard");
  const refreshTokenWard = Cookies.get("refreshTokenWard");
  //@ts-ignore
  const [isChecking, setIsChecking] = useState(true);
  const [isOpen, openModal, closeModal] = useBooleanState();

  const { remaining, reset } = useAutoLogout();

  const navigateSignin = useCallbackOnce(() => {
    console.error("로그인이 필요한 서비스입니다.");
    navigate(RoutePath.Signin);
  }, []);

  useEffect(() => {
    const userSet = async () => {
      //@ts-ignore
      setUser(await window.electronStore.get("userType"));
    };
    userSet();
  }, []);

  useEffect(() => {
    if (!accessTokenWard || !refreshTokenWard) {
      if (user?.type !== "ADMIN") {
        setUser(null);
      }
    }
  }, [accessTokenWard, refreshTokenWard]);

  useEffect(() => {
    if (user) {
      setIsChecking(false);
    } else {
      navigateSignin();
    }
  }, [user, navigate, navigateSignin]);

  useEffect(() => {
    if (remaining) {
      if (remaining < 10000) {
        openModal();
      }
    }
  }, [remaining, openModal]);

  const loginExtension = () => {
    closeModal();
    reset();
  };

  const handleOnClose = () => {
    navigate(-1);
    setIsModalOpen(false);
  };

  if (isChecking) {
    return null;
  }
  if (!userType) {
    return;
  }

  return (
    <Container>
      {/* 자동 로그아웃 경고 모달 */}
      <InfoModal
        open={isOpen}
        onClose={closeModal}
        modalType="checkDelete"
        leftText="취소"
        rightText="연장"
        onConfirm={loginExtension}
        userType={userType}
        message={<AutoLogoutMessage userType={userType} />}
      />

      {/* 스태프 로그인 모달 */}
      <StaffSigninModal onClose={handleOnClose} open={isModal} />

      <Header />
      <Body>
        <Sidebar />
        <OuterContainer>
          <InnerContainer />
        </OuterContainer>
      </Body>
    </Container>
  );
}

/** styles */

const Container = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: theme.palette.primary.main,
}));

const Body = styled(Box)({
  display: "flex",
  minHeight: "100vh",
});

const OuterContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  marginTop: "64px", // header
  marginLeft: "72px", // sidebar
  backgroundColor: theme.palette.background.default,
  // width: "100%",
  width: "calc(100% - 72px)",
}));

// const InnerContainer = styled(Stack)(({ theme }) => ({
//   margin: "30px",
//   padding: "30px",
//   borderRadius: "24px",
//   backgroundColor: theme.palette.background.paper,
// }));
