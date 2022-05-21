import { atom } from "recoil";
import { CampaignType } from "./campaign";

export const endCampaignListState = atom<CampaignType[]>({
  key: "endCampaignListState",
  default: [],
});
