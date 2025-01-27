import { SwitchCase } from "@toss/react";
import { UserTypes } from "@models/home";

import MainPatientListBox from "./main/MainpatientListBox";
import StaffPatientListBox from "./staff/StaffpatientListBox";
import CompletedPatientListBox from "./completedRequest/CompletedpatientListBox";

/*
 * user // mainwait, mainAccept, staffWait 등등으로 분리
 * data // 응답 데이터
 * roomId // 포커스 roomId
 * setRoomId // 상태관리 id
 * refetchProps // react-query refetch함수
 */
export default function PatientBox({
  user,
  data,
  onMutates,
  roomId,
  setRoomId,
  refetchProps,
}: UserTypes) {
  return (
    <>
      <SwitchCase
        value={user}
        caseBy={{
          mainWait: <MainPatientListBox isAccept={false} data={data} onMutates={onMutates!} />,
          mainAccept: <MainPatientListBox isAccept={true} data={data} onMutates={onMutates!} />,

          staffWait: (
            <StaffPatientListBox
              isAccept={false}
              data={data}
              onMutates={onMutates!}
              refetchProps={refetchProps}
            />
          ),

          staffAccept: (
            <StaffPatientListBox
              isAccept={true}
              data={data}
              onMutates={onMutates!}
              roomId={roomId}
              setRoomId={setRoomId}
              refetchProps={refetchProps}
            />
          ),

          completedRequest: (
            <CompletedPatientListBox
              data={data}
              onMutates={onMutates!}
              roomId={roomId}
              setRoomId={setRoomId}
            />
          ),
        }}
      />
    </>
  );
}
