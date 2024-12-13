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

export type NewPassword = {
  password: string;
  confirmPassword: string;
};

export type NewPassWordField = {
  name: keyof NewPassword;
  label: string;
  placeholder: string;
};

export type EditStaffRequest = {
  staffId: number;
  staffRole: string;
  areaId: number;
  email: string;
};

export type EditStaff = {
  name: string;
  staffRole: string;
  area: string;
  id: string;
  phoneNumber: string;
  email: string;
};

export type EditStaffField = {
  name: keyof EditStaff;
  label: string;
  placeholder: string;
};

export type EditMultiStaff = {
  staffRole: string;
  area: string;
};

export type EditMultiStaffField = {
  name: keyof EditMultiStaff;
  label: string;
};
