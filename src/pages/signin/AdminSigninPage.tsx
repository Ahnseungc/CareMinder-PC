import { Thumbnail, CreateAdminButton, SigninLayout } from "@components/signin";
import { adminPopupState, userState } from "@libraries/recoil";
import { Grid, Link } from "@mui/material";
import RoutePath from "@routes/routePath";
import { useRecoilState, useRecoilValue } from "recoil";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import InfoModal from "@components/settings/modal/InfoModal";
import adminPendingState from "@libraries/recoil/adminPending";
import { isElectron } from "@utils/isElectron";

export default function AdminSigninPage() {
  const user = useRecoilValue(userState);
  const accessTokenAdmin = Cookies.get("accessTokenAdmin");
  const [adminPopup, setAdminPopup] = useRecoilState(adminPopupState);
  const [adminPending, setAdminPending] = useRecoilState(adminPendingState);
  const accessToken = Cookies.get("accessTokenAdmin");

  const navigate = useNavigate();

  useEffect(() => {
    if (isElectron()) {
      if (accessTokenAdmin && user?.type === "ADMIN") {
        navigate("/admin");
      }
      if (accessToken && user?.type === "WARD") {
        navigate("/");
      }
    } else {
      if (user && accessToken) {
        console.error(`접근이 불가능한 경로입니다.`);
        navigate(-1);
      }
    }
  }, []);

  return (
    <>
      {/* 어드민 페이지 첫 경고 안내 모달 */}
      <InfoModal open={adminPopup} onClose={() => setAdminPopup(false)} modalType={"adminPopup"} />

      {/* 어드민 계정 승인 대기 모달 */}
      <InfoModal open={adminPending} onClose={() => setAdminPending(false)} modalType={"waiting"} />

      <Grid container>
        <Thumbnail isAdmin />
        <SigninLayout
          type="ADMIN"
          footer={
            <Link href={RoutePath.Signin} variant="h3">
              병동 계정 로그인
            </Link>
          }
          options={<CreateAdminButton />}
        />
      </Grid>
    </>
  );
}
