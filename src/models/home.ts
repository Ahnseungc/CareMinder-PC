export type UserTypes = {
  user:
    | "mainWait"
    | "mainAccept"
    | "staffWait"
    | "staffAccept"
    | "completedRequest"
    | "completedRequestFocus";
  data: RequestsData;
  onWaitOrAccept?: (id: number, type: "wait" | "accept") => void;
};

export type MainListBoxProps = {
  isAccept: boolean;
  data: RequestsData;
  onWaitOrAccept: (id: number, type: "wait" | "accept") => void;
};

export type StaffListBoxProps = {
  isAccept: boolean;
  data: RequestsData;
};

export type CSwitchType = React.ChangeEvent<HTMLInputElement>;

export type PatientStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export type CSwitchProps = "간호사" | "조무사" | "직원" | "의사" | "전체";
export type isRoleType =
  | "NURSE"
  | "NURSE_ASSISTANT"
  | "WORKER"
  | "DOCTOR"
  | "NOT_CLASSIFIED"
  | null;

export type RequestsData = {
  requestStatus: PatientStatus;
  content: string;
  areaSimple: {
    areaId: number;
    areaName: string;
  };
  tabletSimple: {
    tabletId: number;
    tabletName: string;
  };
  patientSimple: {
    patientId: number;
    patientName: string;
  };
  staffSimple: {
    staffId: number;
    staffRole: "NURSE";
    name: string;
  };
  createdAt: string;
  aiRole: Exclude<isRoleType, null>;
  patientRequestId: number;
};

type NewRequestsData = Omit<RequestsData, "tabletSimple" | "patientSimple">;

export type RequestsGroupData = {
  tabletSimple: Pick<RequestsData, "tabletSimple">;
  patientSimple: Pick<RequestsData, "patientSimple">;
  patientRequests: NewRequestsData[];
};
