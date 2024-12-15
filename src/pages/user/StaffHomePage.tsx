import PatientBox from "@components/common/patientListBox";
import ChangeModal from "@components/settings/modal/ChangeModal";
import StaffGroupList from "@components/common/patientListBox/staff/StaffGroupList";
import { useStaffAccept, useStaffComplete } from "@hooks/mutation";
import {
  useGetStaffPatientInprogress,
  useGetStaffPatientInprogressGroup,
  useGetStaffPatientPending,
} from "@hooks/queries";
import { userState } from "@libraries/recoil";
import layoutState from "@libraries/recoil/layout";
import reqChangePWState from "@libraries/recoil/reqChangePW";
import { Typography } from "@mui/material";
import { useBooleanState } from "@toss/react";
// import { isFindRole } from "@utils/homePage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
// import { OPTIONS } from "@components/settings/const";
import * as S from "./Style/wardAndStaff.style";
import StaffSearchBox from "@components/common/SearachBox/StaffSearchBox";

export default function StaffHomePage() {
  const setlayoutState = useSetRecoilState(layoutState);
  const [userStatus] = useRecoilState(userState);
  const [reqChangePWStatus] = useRecoilState(reqChangePWState);
  const [isRequestModalOpen, openRequestModal, closeRequestModal] = useBooleanState(false);
  const navigate = useNavigate();

  const [staffAcceptIsGroup, setStaffAcceptIsGroup] = useState<boolean>(false); //수락중인 환자, 환자별로 묶기
  const [roomId, setRoomId] = useState<number | null>(null);

  const { data: getPending, refetch: pendingRefetch } = useGetStaffPatientPending(null, false); //isRole, 내 환자 보기
  const { data: getInprogress, refetch: inprogressRefetch } =
    useGetStaffPatientInprogress(staffAcceptIsGroup);
  //@ts-ignore
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

  const onMutates = (e: React.MouseEvent, id: number, type: string) => {
    e.stopPropagation();
    if (type === "wait") {
      return postAccept(id);
    }
    if (type === "accept") {
      return patchComplete(id);
    }
  };

  useEffect(() => {
    setlayoutState("home");
    if (reqChangePWStatus) {
      openRequestModal();
    }

    switch (userStatus?.type) {
      case "WARD":
        navigate("/");
        break;
      case "STAFF":
        navigate("/staff");
        break;
    }
  }, []);

  const handleChangePW = () => {
    console.log("비밀번호 변경");
  };

  return (
    <>
      <ChangeModal
        open={isRequestModalOpen}
        onClose={closeRequestModal}
        onConfirm={handleChangePW}
        modalTitle={"비밀번호 변경 요청"}
        subTitle={
          <Typography variant="body1" sx={{ textAlign: "center", lineHeight: "1.8" }}>
            비밀번호 변경 요청이 왔습니다. 비밀번호를 변경해주세요.
            <br /> 2024년 11월 30일까지 변경하지 않을 경우, 계정이 잠기게 됩니다.
          </Typography>
        }
        rightText={"변경하기"}
        isPasswordChange={true}
      />
      <S.LeftSection>
        <S.TitleWrapper>
          <S.Title>대기중인 환자</S.Title>
          <S.SearchBoxWrapper>
            <StaffSearchBox />
          </S.SearchBoxWrapper>
        </S.TitleWrapper>
        <S.SubTitle>
          <S.SubTitleLeft>
            <div>필터</div>
            <S.FilterBox>환자별</S.FilterBox>
            <S.FilterBox>구역</S.FilterBox>
            <S.FilterBox>직종</S.FilterBox>
          </S.SubTitleLeft>
        </S.SubTitle>
        {getPending?.map(el => (
          <PatientBox
            key={el.patientRequestId}
            user="staffWait"
            data={el}
            onMutates={onMutates}
            refetchProps={refetchProps}
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
            <S.FilterBox onClick={() => setStaffAcceptIsGroup(prev => !prev)}>환자별</S.FilterBox>
            <S.FilterBox>구역</S.FilterBox>
            <S.FilterBox>직종</S.FilterBox>
          </S.SubTitleLeft>
        </S.SubTitle>
        {!staffAcceptIsGroup &&
          getInprogress?.map(el => (
            <PatientBox
              key={el.patientRequestId}
              user="staffAccept"
              data={el}
              onMutates={onMutates}
              roomId={roomId}
              setRoomId={setRoomId}
              refetchProps={refetchProps}
            />
          ))}
        {staffAcceptIsGroup &&
          getInprogressGroup?.map(el => (
            <StaffGroupList data={el} onMutates={onMutates} roomId={roomId} setRoomId={setRoomId} />
          ))}
      </S.RightSection>
    </>
  );
}
