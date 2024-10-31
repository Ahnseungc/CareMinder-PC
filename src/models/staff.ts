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
