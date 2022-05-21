import { atom } from "recoil";

export interface NoticeType {
  notice_seq: number;
  author: number;
  title: string;
  content: string;
  view_count: number;
  first_register_id: number;
  first_register_date: Date;
  last_register_id: number;
  last_register_date: Date;
}

export const noticeState = atom<NoticeType[]>({
  key: "noticeState",
  default: [],
});
