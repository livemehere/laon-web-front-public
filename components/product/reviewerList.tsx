import React from "react";
import { CampaignType } from "../../recoil/atoms/campaign";

interface Props {
  campaign: CampaignType;
  isSelected: boolean;
}

const ReviewerList: React.FC<Props> = ({ campaign, isSelected }) => {
  return (
    <div className={"tw-grid tw-grid-cols-3 tw-gap-5 tw-my-10"}>
      {campaign.applicant.map((r) => {
        if (isSelected) {
          if (r.status === 1) {
            return (
              <div key={r.user_seq} className={"tw-flex"}>
                <div>
                  <img
                    src={
                      r.profile_path ? "/images/userIcon.png" : r.profile_path!
                    }
                    alt="avatar"
                    className={
                      "tw-w-[50px] tw-h-[50px] tw-object-cover tw-rounded-full tw-mr-3"
                    }
                  />
                </div>
                <div className={"tw-flex tw-items-center"}>{r.nickname}</div>
              </div>
            );
          }
        } else {
          return (
            <div key={r.user_seq} className={"tw-flex"}>
              <div>
                <img
                  src={
                    r.profile_path ? r.profile_path! : "/images/userIcon.png"
                  }
                  alt="profile_url"
                  className={
                    "tw-w-[50px] tw-h-[50px] tw-object-cover tw-rounded-full tw-mr-3"
                  }
                />
              </div>
              <div className={"tw-flex tw-items-center"}>{r.nickname}</div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default ReviewerList;
