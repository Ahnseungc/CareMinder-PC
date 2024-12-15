import PatientBox from "@components/common/patientListBox";
import StaffSigninModal from "@components/signin/staff/StaffSigninModal";
import { useGetWardPatientInProgress, useGetWardPatientPending } from "@hooks/queries";
import { userState } from "@libraries/recoil";
import layoutState from "@libraries/recoil/layout";
import modalState from "@libraries/recoil/modal";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import * as S from "./Style/wardAndStaff.style";
import StaffSearchBox from "@components/common/SearachBox/StaffSearchBox";

export default function MainHomePage() {
  const navigate = useNavigate();
  const setlayoutState = useSetRecoilState(layoutState);
  const [isModal, setIsModal] = useRecoilState(modalState);
  const [userStatus] = useRecoilState(userState);

  const { data: getPendingData } = useGetWardPatientPending(userStatus!.type);
  const { data: getInprogressData } = useGetWardPatientInProgress(userStatus!.type);

  const onStaffLogIn = () => {
    if (userStatus?.type === "WARD") {
      setIsModal(true);
    }
  };

  const handleOnClose = () => {
    setIsModal(false);
  };

  useEffect(() => {
    setlayoutState("home");

    switch (userStatus?.type) {
      case "WARD":
        navigate("/");
        break;
      case "STAFF":
        navigate("/staff");
        break;
    }
  }, []);

  return (
    <>
      <>
        <StaffSigninModal onClose={handleOnClose} open={isModal} />
        <S.LeftSection>
          <S.TitleWrapper>
            <S.Title>대기중인 환자</S.Title>
            <S.SearchBoxWrapper onClick={onStaffLogIn}>
              <StaffSearchBox />
            </S.SearchBoxWrapper>
          </S.TitleWrapper>
          <S.SubTitle>
            <S.SubTitleLeft>
              <div>필터</div>
              <S.FilterBox onClick={onStaffLogIn}>환자별</S.FilterBox>
              <S.FilterBox onClick={onStaffLogIn}>구역</S.FilterBox>
              <S.FilterBox onClick={onStaffLogIn}>직종</S.FilterBox>
            </S.SubTitleLeft>
          </S.SubTitle>
          {getPendingData?.map(el => (
            <PatientBox
              key={el.patientRequestId}
              user="mainWait"
              data={el}
              onMutates={onStaffLogIn}
            />
          ))}
        </S.LeftSection>
        <S.RightSection>
          <S.TitleWrapper>
            <S.Title>수락 중인 환자</S.Title>
            <S.SearchBoxWrapper>
              <StaffSearchBox />
            </S.SearchBoxWrapper>
          </S.TitleWrapper>
          <S.SubTitle>
            <S.SubTitleLeft>
              <div>필터</div>
              <S.FilterBox onClick={onStaffLogIn}>환자별</S.FilterBox>
              <S.FilterBox onClick={onStaffLogIn}>구역</S.FilterBox>
              <S.FilterBox onClick={onStaffLogIn}>직종</S.FilterBox>
            </S.SubTitleLeft>
          </S.SubTitle>
          {getInprogressData?.map(el => (
            <PatientBox
              key={el.patientRequestId}
              user="mainAccept"
              data={el}
              onMutates={onStaffLogIn}
            />
          ))}
        </S.RightSection>
      </>
    </>
  );
}
