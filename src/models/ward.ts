export type Ward = {
  section: string;
  wardName: string;
  managerName: string;
  loginId: string;
  password: string;
  managerPhoneNumber: string;
  managerEmail: string;
};

export type NewWardRequest = {
  wardName: string;
  loginId: string;
  password: string;
  managerName: string;
  managerPhoneNumber: string;
  managerEmail: string;
};

export type NewWard = NewWardRequest & { confirmPassword: string };

export type NewWardField = {
  name: keyof NewWard;
  label: string;
  placeholder: string;
};
