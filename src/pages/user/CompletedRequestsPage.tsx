// import CSwitch from "@components/common/atom/C-Switch";
import { styled } from "@mui/material";
import { useState } from "react";
// import { ReactComponent as PersonIcon } from "@/assets/completedRequests/person.svg";
// import { ReactComponent as HamburgerIcon } from "@/assets/completedRequests/hamburger.svg";
import PatientBox from "@components/common/patientListBox";
import { RequestsData } from "@models/home";
import useGetCompleted from "@hooks/queries/useGetCompleted";
// import useGetCompletedGroup from "@hooks/queries/useGetCompletedGroup";

export default function CompletedRequestsPage() {
  // const [isPatient, setIsPatient] = useState<boolean>(false);
  //@ts-ignore
  const [isFocusPatientData, setIsFocusPatientData] = useState<null | RequestsData>();
  // const [myArea, setMyArea] = useState(false);
  const { data: getCompleted } = useGetCompleted(false);
  // const { data: getCompletedGroup } = useGetCompletedGroup(myArea);

  return (
    <Wrapper>
      <Title>완료 요청 히스토리</Title>
      <SubTitle>
        {/* <span>완료된 내 구역 요청 리스트</span>
        <CSwitch onChange={() => setMyArea(prev => !prev)} />
        <span>환자별로 보기</span> <CSwitch onChange={() => setIsPatient(prev => !prev)} /> */}
      </SubTitle>
      <Container>
        <LeftWrapper>
          {/* {isPatient && (
            <Person>
              <PersonIcon /> <div>홍길동</div>
              <HamburgerIcon />
            </Person>
          )} */}
          <PatientList>
            {getCompleted?.map(el => (
              <div key={el.patientRequestId} onClick={() => setIsFocusPatientData(el)}>
                <PatientBox
                  key={el.patientRequestId}
                  user="completedRequest"
                  data={el}
                  roomId={isFocusPatientData?.patientRequestId}
                />
              </div>
            ))}
          </PatientList>
        </LeftWrapper>
        <RightWrapper>
          {isFocusPatientData && (
            <>
              {/* {isPatient && <Empty />} */}
              <PatientBox user="completedRequestFocus" data={isFocusPatientData} />
            </>
          )}
        </RightWrapper>
      </Container>
    </Wrapper>
  );
}
const Wrapper = styled("div")``;
const Container = styled("div")`
  display: flex;
`;
const LeftWrapper = styled("div")`
  width: 50%;
  margin-right: 8px;
`;
const RightWrapper = styled("div")`
  width: 50%;
  margin-left: 8px;
`;
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
  & > * {
    margin-right: 17px;
  }
`;
// const Person = styled("div")`
//   margin: 33px 0 15px 0;
//   display: flex;
//   align-items: center;
//   & > div {
//     font-size: 18px;
//     font-weight: 700;
//     color: #000000;
//     margin: 0 7px 0 17px;
//     margin-top: 5px;
//   }
// `;
const PatientList = styled("div")``;
// const Empty = styled("div")`
//   margin-top: 81px;
// `;
