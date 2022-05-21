import { atom } from "recoil";
import { CampaignType } from "./campaign";

export const favorCampaignListState = atom<CampaignType[]>({
  key: "favorCampaignListState",
  default: [],
});
