import { SwitchCase } from "@toss/react";

import StaffPatientListBox from "./staff/StaffpatientListBox";
import MainPatientListBox from "./main/MainpatientListBox";
import CompletedPatientListBox from "./completedRequest/CompletedpatientListBox";
import { UserTypes } from "@models/home";

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
              isAccept={false}
              data={data}
              onMutates={onMutates!}
              roomId={roomId}
            />
          ),
          completedRequestFocus: (
            <CompletedPatientListBox isAccept={true} data={data} onMutates={onMutates!} />
          ),
        }}
      />
    </>
  );
}
