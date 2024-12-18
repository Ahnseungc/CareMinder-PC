export type UserType = "ADMIN" | "WARD" | "STAFF";

export type User = {
  id: number;
  name: string;
  type: UserType;
};

export type AdminUser = {
  name: string;
  hospitalName: string;
  postalCode: string;
  mainAddress: string;
  detailAddress: string;
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
    managerName: string;
    managerPhoneNumber: string;
    managerEmail: string;
    nfc: string;
    fingerprint: string;
  };
  hospitalCreateRequest: {
    name: string;
    address: {
      postalCode: string;
      mainAddress: string;
      detailAddress: string;
    };
    businessRegistrationNumber: string;
  };
};
