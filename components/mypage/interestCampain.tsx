import React, { useEffect, useState } from "react";
import CardList from "../common/cardList";
import { CampaignType } from "../../recoil/atoms/campaign";
import AxiosManager from "../../util/axiosManager";
import { useRecoilState } from "recoil";
import { userState } from "../../recoil/atoms/userAtom";

interface InterestCampainProps {}

const InterestCampain: React.FC<InterestCampainProps> = ({ children }) => {
  const [interestCamp, setInterestCamp] = useState<CampaignType[]>();
  const [user, setUser] = useRecoilState(userState);

  const getInterestCamp = async () => {
    const r = await AxiosManager.get(`/users/interest-campaign`, {
      user_seq: user?.user_seq,
    });
    if (r.status === 200) {
      setInterestCamp(r.data.interestCampaign);
    }
  };

  useEffect(() => {
    getInterestCamp();
  }, [user]);

  return (
    <div className="tw-mt-10 tw-pl-10">
      <h3 className="tw-mb-5 tw-border-gray-200 tw-border-b-[1.5px] tw-pb-3">
        관심 캠페인
      </h3>
      <div className="tw-pt-10">
        {interestCamp && (
          <CardList data={interestCamp} isFilter={false} col={3} />
        )}
      </div>
    </div>
  );
};

export default InterestCampain;
