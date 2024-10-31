import { Thumbnail, CreateAdminButton, SigninLayout } from "@components/signin";
import { adminPopupState, userState } from "@libraries/recoil";
import { Grid, Link } from "@mui/material";
import RoutePath from "@routes/routePath";
import { useRecoilState, useRecoilValue } from "recoil";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import InfoModal from "@components/settings/modal/InfoModal";

export default function AdminSigninPage() {
  const user = useRecoilValue(userState);
  const [adminPopup, setAdminPopup] = useRecoilState(adminPopupState);
  const accessToken = Cookies.get("accessTokenAdmin");

  const navigate = useNavigate();

  useEffect(() => {
    if (user && accessToken) {
      console.error(`접근이 불가능한 경로입니다.`);
      navigate(-1);
    }
  }, []);

  return (
    <>
      <InfoModal
        open={adminPopup}
        onClose={() => setAdminPopup(false)}
        modalType={"adminPopup"}
      ></InfoModal>
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
