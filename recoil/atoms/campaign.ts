import { atom } from "recoil";

export interface ApplicantType {
  user_seq: number;
  campaign_seq: number;
  acquaint_content: number;
  select_reward: string;
  camera_code: string;
  face_exposure: number;
  address: string;
  receiver: string;
  recevier_phonenumber: string;
  joint_blog: number;
  status: number;
  first_register_id: number;
  first_register_date: string;
  last_register_id: number;
  last_register_date: string;
  id: string;
  name: string;
  nickname: string;
  phonenumber: string;
  gender: string;
  birth: string;
  email: string;
  is_premium: number;
  is_advertiser: number;
  blog: string;
  instagram: string;
  influencer: string;
  youtube: string;
  point: number;
  profile_name: string | null;
  profile_path: string | null;
  profile_ext: string | null;
  other_answers: string;
}

export interface CampaignFileType {
  file_seq: number;
  campaign_seq: number;
  name: string;
  path: string;
  extension: string;
  first_register_id: number;
  first_register_date: string;
  last_register_id: number;
  last_register_date: string;
}

export interface CampaignType {
  status?: number;
  campaign_seq: number;
  advertiser: number;
  is_premium: number;
  title: string;
  category: string;
  product: string;
  channel: string;
  area: string;
  keyword: string;
  headcount: number;
  siteURL: string;
  misson: string;
  reward: string;
  address: string;
  original_price: number;
  discount_price: number;
  accrual_point: number;
  campaign_guide: string;
  recruit_start_date: string;
  recruit_end_date: string;
  review_start_date: string | null;
  review_end_date: string | null;
  campaign_end_date: string | null;
  reviewer_announcement_date: string;
  agreement_portrait: number;
  agreement_provide_info: number;
  campaign_state: number;
  view_count: number;
  first_register_id: number;
  first_register_date: string;
  applicant_count: number;
  qna: [];
  campaign_file: CampaignFileType[];
  applicant: ApplicantType[];
}

export const campaignListState = atom<CampaignType[]>({
  key: "campaignListState",
  default: [],
});
