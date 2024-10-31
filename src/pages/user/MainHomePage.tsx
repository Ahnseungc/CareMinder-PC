import { CComboBox } from "@components/common/atom/C-ComboBox";
import CSwitch from "@components/common/atom/C-Switch";
import PatientBox from "@components/common/patientListBox";
import StaffSigninModal from "@components/signin/staff/StaffSigninModal";
import { useGetWardPatientInProgress, useGetWardPatientPending } from "@hooks/queries";
import { userState } from "@libraries/recoil";
import layoutState from "@libraries/recoil/layout";
import modalState from "@libraries/recoil/modal";
import { Box, styled } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";

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

  const onWaitOrAccept = () => {
    onStaffLogIn();
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
        <LeftSection>
          <Title>대기중인 환자</Title>
          <SubTitle>
            <SubTitleLeft>
              <span>내 환자만 보기</span>
              <span onClick={onStaffLogIn}>
                <CSwitch disabled={userStatus?.type === "WARD"} />
              </span>
            </SubTitleLeft>
            <SubTitleRight onClick={onStaffLogIn} isDisable={userStatus?.type === "WARD"}>
              <span>직종</span>
              <CComboBox
                placeholder={"전체"}
                options={["테스트1", "테스트2"]}
                value={""}
                onChange={() => onStaffLogIn}
              />
            </SubTitleRight>
          </SubTitle>
          {getPendingData?.map(el => (
            <PatientBox
              key={el.patientRequestId}
              user="mainWait"
              data={el}
              onWaitOrAccept={onWaitOrAccept}
            />
          ))}
        </LeftSection>
        <RightSection>
          <Title>수락중인 환자</Title>
          <SubTitle>
            <SubTitleLeft>
              <span>환자별로 묶기</span>
              <span onClick={onStaffLogIn}>
                <CSwitch disabled={userStatus?.type === "WARD"} />
              </span>
            </SubTitleLeft>
          </SubTitle>
          {getInprogressData?.map(el => (
            <PatientBox
              key={el.patientRequestId}
              user="mainAccept"
              data={el}
              onWaitOrAccept={onWaitOrAccept}
            />
          ))}
        </RightSection>
      </>
    </>
  );
}

const SectionBase = styled(Box)(({ theme }) => ({
  width: "calc(50% - 15px)",
  padding: "30px",
  borderRadius: "24px",
  backgroundColor: theme.palette.background.paper,
}));

const LeftSection = styled(SectionBase)({
  // 왼쪽 컨테이너에 스타일 적용
});

const RightSection = styled(SectionBase)({
  // 오른쪽 컨테이너에 스타일 적용
});
const Title = styled("div")`
  font-weight: 700;
  font-size: 24px;
  color: #000000;
  margin-bottom: 26px;
`;
const SubTitle = styled("div")`
  font-weight: 500;
  font-size: 18px;
  color: #000000;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const SubTitleLeft = styled("div")`
  & > span {
    margin-right: 18px;
  }
`;
const SubTitleRight = styled("div")<{ isDisable: boolean }>`
  display: flex;
  align-items: center;
  height: 35px;
  & > * {
    font-size: 14px;
  }
  & > span {
    width: 40px;
    margin-right: 12px;
  }
  & > *:last-child {
    pointer-events: ${({ isDisable }) => (isDisable ? "none" : "auto")};
  }
`;
