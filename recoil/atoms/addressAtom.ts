import { atom } from "recoil";

export interface AddressType {
  address_seq: number;
  user_seq: number;
  name: string;
  receiver: string;
  address: string;
  phonenumber: string;
  is_default: number;
  first_register_id: number;
  first_register_date: string;
  last_register_id: number;
  last_register_date: string;
}

export const addressState = atom<AddressType[] | null>({
  key: "addressState",
  default: null,
});
