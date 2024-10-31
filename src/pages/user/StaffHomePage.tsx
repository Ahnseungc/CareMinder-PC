import { CComboBox } from "@components/common/atom/C-ComboBox";
import CSwitch from "@components/common/atom/C-Switch";
import PatientBox from "@components/common/patientListBox";
import { useStaffAccept, useStaffComplete } from "@hooks/mutation";
import {
  useGetStaffPatientInprogress,
  useGetStaffPatientInprogressGroup,
  useGetStaffPatientPending,
} from "@hooks/queries";
import { userState } from "@libraries/recoil";
import layoutState from "@libraries/recoil/layout";
import { CSwitchType, isRoleType } from "@models/home";
import { Box, styled } from "@mui/material";
import { isFindRole } from "@utils/homePage";
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
  const [roomId, setRoomId] = useState<number | null>(null);

  const { data: getPending, refetch: pendingRefetch } = useGetStaffPatientPending(
    isRole,
    staffWaitIsMine,
  );
  const { data: getInprogress, refetch: inprogressRefetch } =
    useGetStaffPatientInprogress(staffAcceptIsGroup);
  const { data: getInprogressGroup, refetch: inprogressGroupRefetch } =
    useGetStaffPatientInprogressGroup(staffAcceptIsGroup);

  const refetchProps = {
    pendingRefetch,
    inprogressRefetch,
    inprogressGroupRefetch,
    staffAcceptIsGroup,
  };

  const { mutate: postAccept } = useStaffAccept(refetchProps);
  const { mutate: patchComplete } = useStaffComplete(refetchProps);

  const onWaitOrAccept = (e: React.MouseEvent, id: number, type: "wait" | "accept") => {
    e.stopPropagation();
    if (type === "wait") return postAccept(id);
    if (type === "accept") return patchComplete(id);
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
        {getPending?.map(el => (
          <PatientBox
            key={el.patientRequestId}
            user="staffWait"
            data={el}
            onWaitOrAccept={onWaitOrAccept}
            refetchProps={refetchProps}
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
        {!staffAcceptIsGroup &&
          getInprogress?.map(el => (
            <PatientBox
              key={el.patientRequestId}
              user="staffAccept"
              data={el}
              onWaitOrAccept={onWaitOrAccept}
              roomId={roomId}
              setRoomId={setRoomId}
              refetchProps={refetchProps}
            />
          ))}
        {/* 디자인 나오기 전이여서 주석 처리 */}
        {staffAcceptIsGroup && (
          // getInprogressGroup?.map(el => (
          //   <PatientBox
          //     key={el.patientRequestId}
          //     user="staffAccept"
          //     data={el}
          //     onWaitOrAccept={onWaitOrAccept}
          //   />
          // ))
          <></>
        )}
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
