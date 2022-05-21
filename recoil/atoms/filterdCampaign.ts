import { atom } from "recoil";
import { CampaignType } from "./campaign";

export const filterdCampaignListState = atom<CampaignType[]>({
  key: "filterdCampaignListState",
  default: [],
});
