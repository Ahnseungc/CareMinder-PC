export type Ward = {
  section: string;
  wardName: string;
  manageName: string;
  loginId: string;
  password: string;
  managePhoneNumber: string;
  manageEmail: string;
};

export type NewWard = {
  wardName: string;
  loginId: string;
  password: string;
  confirmPassword: string;
  manageName: string;
  managePhoneNumber: string;
  manageEmail: string;
};

export type NewWardField = {
  name: keyof NewWard;
  label: string;
  placeholder: string;
};
