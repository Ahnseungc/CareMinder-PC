export type WardTabletType = {
  areaId: number;
  tabletId: number;
  areaName: string;
  tabletName: string;
  serialNumber: string;
  patientId: number;
  patientName: string;
};

export type reqWardParamsType = {
  token: string;
  patientName: string;
  myArea: boolean;
};

export type selectedWardType = {
  tabletIds: Array<number>;
};
