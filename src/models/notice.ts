export type NoticeType = {
  wardId: number;
  recipient?: string;
  title: string;
  content: string;
  fileUrl: string;
  lastModifiedAt?: string;
};
