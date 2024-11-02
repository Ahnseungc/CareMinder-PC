export type NewStaff = {
  name: string;
  occupation: string;
  username: string;
  password: string;
  phoneNumber: string;
  email: string;
};

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

export type Message = {
  content: string;
  createdAt: string;
  role: string;
  senderName: string; //문의 후 수정 필요
};
