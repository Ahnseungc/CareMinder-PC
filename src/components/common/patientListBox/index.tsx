import { SwitchCase } from "@toss/react";

import StaffPatientListBox from "./staff/StaffpatientListBox";
import MainPatientListBox from "./main/MainpatientListBox";
import CompletedPatientListBox from "./completedRequest/CompletedpatientListBox";
import { UserTypes } from "@models/home";

export default function PatientBox({
  user,
  data,
  onWaitOrAccept,
  roomId,
  setRoomId,
  refetchProps,
}: UserTypes) {
  return (
    <>
      <SwitchCase
        value={user}
        caseBy={{
          mainWait: (
            <MainPatientListBox isAccept={false} data={data} onWaitOrAccept={onWaitOrAccept!} />
          ),
          mainAccept: (
            <MainPatientListBox isAccept={true} data={data} onWaitOrAccept={onWaitOrAccept!} />
          ),
          staffWait: (
            <StaffPatientListBox
              isAccept={false}
              data={data}
              onWaitOrAccept={onWaitOrAccept!}
              refetchProps={refetchProps}
            />
          ),
          staffAccept: (
            <StaffPatientListBox
              isAccept={true}
              data={data}
              onWaitOrAccept={onWaitOrAccept!}
              roomId={roomId}
              setRoomId={setRoomId}
              refetchProps={refetchProps}
            />
          ),
          completedRequest: <CompletedPatientListBox isAccept={false} data={data} />,
          completedRequestFocus: <CompletedPatientListBox isAccept={true} data={data} />,
        }}
      />
    </>
  );
}
