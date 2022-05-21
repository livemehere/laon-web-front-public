import { atom } from "recoil";

interface InterestInfoType {
  user_seq: number;
  user_interest_code: string;
  code_name: string;
  first_register_id: number;
  first_register_date: Date;
}
interface AreaInfoType {
  user_seq: number;
  user_area_code: string;
  code_name: string;
  first_register_id: number;
  first_register_date: Date;
}

interface ChannelInfoType {
  user_seq: number;
  user_channel_code: string;
  code_name: string;
  first_register_id: number;
  first_register_date: Date;
}

export interface AdditionalInfoType {
  interest: InterestInfoType[];
  area: AreaInfoType[];
  channel: ChannelInfoType[];
}

export const additionalInfoState = atom<AdditionalInfoType | null>({
  key: "additionalInfoState",
  default: null,
});
