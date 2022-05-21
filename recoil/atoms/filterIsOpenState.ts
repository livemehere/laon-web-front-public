import { atom } from "recoil";

export const filterIsOpenState = atom<boolean>({
  key: "filterIsOpenState",
  default: false,
});
