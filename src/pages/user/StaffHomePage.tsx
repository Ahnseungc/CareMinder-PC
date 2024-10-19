import { CComboBox } from "@components/common/atom/C-ComboBox";
import CSwitch from "@components/common/atom/C-Switch";
import PatientBox from "@components/common/patientListBox";
import { waitPatientmockData } from "@components/home/wordMainMockData";
import { useStaffAccept } from "@hooks/mutation/useStaffAccept";
import useGetStaffPatientInprogress from "@hooks/queries/useGetStaffPatientInprogress";
import useGetStaffPatientInprogressGroup from "@hooks/queries/useGetStaffPatientInprogressGroup";
import useGetStaffPatientPending from "@hooks/queries/useGetStaffPatientPending";
import { userState } from "@libraries/recoil";
import layoutState from "@libraries/recoil/layout";
import { CSwitchProps, CSwitchType, isRoleType } from "@models/home";
import { Box, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";

export default function StaffHomePage() {
  const setlayoutState = useSetRecoilState(layoutState);
  const [userStatus] = useRecoilState(userState);
  const navigate = useNavigate();
  const [staffWaitIsMine, setStaffWaitIsMine] = useState<boolean>(false); //대기중인 내 환자 보기
  const [staffAcceptIsGroup, setStaffAcceptIsGroup] = useState<boolean>(false); //수락중인 환자, 환자별로 묶기
  const [isRole, setIsRole] = useState<isRoleType>(null);

  const { data: getPending } = useGetStaffPatientPending(isRole, staffWaitIsMine);
  const { data: getInprogress } = useGetStaffPatientInprogress(staffAcceptIsGroup);
  const { data: getInprogressGroup } = useGetStaffPatientInprogressGroup(staffAcceptIsGroup);
  const { mutate: postAccept } = useStaffAccept();

  const onWaitOrAccept = (id: number, type: "wait" | "accept") => {
    //onCheckOrOkay fn은 check버튼인지 okay버튼인지와 그 게시글의 id를 가져온다.
    if (type === "wait") return postAccept(id);
  };

  const isFindRole = (role: CSwitchProps) => {
    switch (role) {
      case "간호사":
        return "NURSE";
      case "조무사":
        return "NURSE_ASSISTANT";
      case "직원":
        return "WORKER";
      case "의사":
        return "DOCTOR";
      case "전체":
        return "NOT_CLASSIFIED";
    }
  };

  useEffect(() => {
    setlayoutState("home");

    switch (userStatus?.type) {
      case "main":
        navigate("/");
        break;
      case "staff":
        navigate("/staff");
        break;
    }
  }, []);

  return (
    <>
      <LeftSection>
        <Title>대기중인 환자</Title>
        <SubTitle>
          <SubTitleLeft>
            <span>내 환자만 보기</span>
            <CSwitch onChange={(el: CSwitchType) => setStaffWaitIsMine(el.target.checked)} />
          </SubTitleLeft>
          <SubTitleRight>
            <span>직종</span>
            <CComboBox
              placeholder={"전체"}
              options={["전체", "간호사", "조무사", "직원", "의사"]}
              value={""}
              onChange={el => setIsRole(isFindRole(el.target.value))}
            />
          </SubTitleRight>
        </SubTitle>
        {waitPatientmockData.map(el => (
          <PatientBox
            key={el.patientRequestId}
            user="staffWait"
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
            <CSwitch onChange={(el: CSwitchType) => setStaffAcceptIsGroup(el.target.checked)} />
          </SubTitleLeft>
        </SubTitle>
        {waitPatientmockData.map(el => (
          <PatientBox
            key={el.patientRequestId}
            user="staffAccept"
            data={el}
            onWaitOrAccept={onWaitOrAccept}
          />
        ))}
      </RightSection>
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
const SubTitleRight = styled("div")`
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
`;
