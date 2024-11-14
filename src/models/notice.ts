export type NoticeReqType = {
  wardId: number;
  recipient?: string;
  title: string;
  content: string;
  fileUrl: string;
  lastModifiedAt?: string;
  recipientIds: Array<number>;
};

export type NoticeType = {
  receivers: Array<ReceiversType>;
  noticeId: number;
  staffId: number;
  title: string;
  content: string;
  fileUrl: string;
  staffName: string;
  staffPhoneNumber: string;
  createdAt: string;
  lastModifiedAt: string;
};

type ReceiversType = {
  patientId: string;
  patientName: string;
};
