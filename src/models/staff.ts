import { PatientStatus, isRoleType } from ".";

export type Staff = {
  name: string;
  occupation: string;
  username: string;
  password: string;
  phoneNumber: string;
  email: string;
};

export type NewStaffRequests = {
  name: string;
  loginId: string;
  password: string;
  phoneNumber: string;
  email: string;
  nfc: string;
  fingerprint: string;
  staffRole: string;
  areaId: number;
};

export type NewStaff = Staff & { confirmPassword: string };

export type NewStaffField = {
  name: keyof NewStaff;
  label: string;
  placeholder: string;
};

export type QuickRegisterNewStaff = {
  label: string;
  value: string;
};
export type VoidFn = () => void;

export type RefetchProps = {
  pendingRefetch: VoidFn;
  inprogressRefetch: VoidFn;
  inprogressGroupRefetch: VoidFn;
  staffAcceptIsGroup: boolean;
};
export type CompleteRefetchProps = {
  refetchComplete: VoidFn;
  refetchCompletedGroup: VoidFn;
  isPatient: boolean;
};

export type Message = {
  content: string;
  createdAt: string;
  role: string;
  senderName: string; //문의 후 수정 필요
};

export type patientMapType = {
  requestStatus: PatientStatus;
  content: string;
  areaSimple: {
    areaId: number;
    areaName: string;
  };
  staffSimple: {
    staffId: number;
    staffRole: Exclude<isRoleType, null>;
    name: string;
  };
  createdAt: string;
  aiRole: Exclude<isRoleType, null>;
  patientRequestId: number;
};

export type staffGroup = {
  tabletSimple: {
    tabletId: number;
    tabletName: string;
    serialNumber: string;
  };
  patientSimple: {
    patientId: number;
    patientName: string;
  };
  patientRequests: patientMapType[];
};
