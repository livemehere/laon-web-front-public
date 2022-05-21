import { atom } from "recoil";

export interface UserType {
  // 기본 유저 정보들
  [key: string]: any; // 만능 추가
  accumulated_point: number;
  agreement_email: number;
  agreement_info: number;
  agreement_mms: number;
  birth: any;
  blog: any;
  bottoms_size: string;
  companion_animal: string;
  email: string;
  first_register_date: string;
  gender: any;
  having_child: number;
  height: string;
  id: string;
  influencer: any;
  instagram: any;
  is_admin: number;
  is_advertiser: number;
  is_premium: number;
  job: any;
  last_register_date: string;
  marital_status: number;
  name: string;
  nickname: string;
  phonenumber: string;
  point: number;
  profile_path: any;
  profile_type: any;
  shoe_size: string;
  skin_type: string;
  tops_size: string;
  user_seq: number;
  youtube: any;
  grade?: number;
  petType?: string;
}

export const userState = atom<UserType | null>({
  key: "userState",
  default: null,
});
