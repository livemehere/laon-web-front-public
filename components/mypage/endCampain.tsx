import React, { useEffect, useState } from "react";
import CardList from "../common/cardList";
import { useRecoilState } from "recoil";
import { favorCampaignListState } from "../../recoil/atoms/favorCampaign";
import { CampaignType } from "../../recoil/atoms/campaign";
import { userState } from "../../recoil/atoms/userAtom";
import AxiosManager from "../../util/axiosManager";
import dayjs from "dayjs";

interface EndCampainProps {}

const EndCampain: React.FC<EndCampainProps> = ({ children }) => {
  const [fCamp, setFCamp] = useRecoilState(favorCampaignListState);

  const [myCamp, setMyCamp] = useState<CampaignType[]>();
  const [user, setUser] = useRecoilState(userState);

  const getMyCamp = async () => {
    const r = await AxiosManager.get(`/users/my-campaign`, {
      user_seq: user?.user_seq,
    });
    if (r.status === 200) {
      setMyCamp(r.data.myCampaign);
    }
  };

  useEffect(() => {
    getMyCamp();
  }, [user]);

  return (
    <div className="tw-mt-10 tw-pl-10">
      <h3 className="tw-mb-5 tw-border-gray-200 tw-border-b-[1.5px] tw-pb-3">
        종료된 캠페인
      </h3>
      <div className="tw-pt-10">
        {myCamp && (
          <CardList
            data={myCamp.filter((c) => {
              if (c.status === 2) return true;
            })}
            isFilter={false}
            col={3}
          />
        )}
      </div>
    </div>
  );
};

export default EndCampain;
