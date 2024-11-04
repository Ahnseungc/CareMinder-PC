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
  id: number;
  staffId: number;
  title: string;
  content: string;
  fileUrl: string;
  createdAt: string;
  lastModifiedAt: string;
};
