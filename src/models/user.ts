export type UserType = "ADMIN" | "WARD" | "STAFF";
export type reqUserType = "ADMIN" | "WARD" | "STAFF";

export type User = {
  id: number;
  name: string;
  type: UserType;
};

export type AdminUser = {
  name: string;
  hospitalName: string;
  hospitalAddress: string;
  registrationNumber: string;
  username: string;
  password: string;
  phoneNumber: string;
  email: string;
};

export type NewAdminUser = AdminUser & { confirmPassword: string };

export type AdminUserField = {
  name: keyof NewAdminUser;
  label: string;
  placeholder: string;
};

export type NewAdminUserRequests = {
  adminSignUpRequest: {
    loginId: string;
    password: string;
    phoneNumber: string;
    email: string;
    nfc: string;
    fingerprint: string;
  };
  hospitalCreateRequest: {
    name: string;
    address: string;
    businessRegistrationNumber: string;
  };
};
