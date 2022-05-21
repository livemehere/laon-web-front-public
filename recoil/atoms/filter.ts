import { atom } from "recoil";

export interface FilterType {
  [index: string]: string[];
  channel: string[];
  product: string[];
  area: string[];
  detail: string[];
  accrual_point: string[];
  sort: string[];
}

export const filterState = atom<FilterType>({
  key: "filterState",
  default: {
    channel: [],
    product: [],
    area: [],
    detail: [],
    accrual_point: [],
    sort: ["최신순"],
  },
});
