import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { useRouter } from "next/router";
import { CampaignType } from "../../recoil/atoms/campaign";

import dayjs from "dayjs";
import "dayjs/locale/ko";
import AxiosManager from "../../util/axiosManager";
import { useRecoilState } from "recoil";
import { favorCampaignListState } from "../../recoil/atoms/favorCampaign";
import { userState } from "../../recoil/atoms/userAtom";
dayjs.locale("ko");

interface CardBoxProps {
  initialLiked: boolean;
  campaign: CampaignType;
  favorList: number[];
}

const CardBox: React.FC<CardBoxProps> = ({
  children,
  initialLiked,
  campaign,
  favorList,
}) => {
  const router = useRouter();
  const [like, setLike] = useState(initialLiked);
  const [dday, setDday] = useState(0);
  const [user, setUser] = useRecoilState(userState);
  const [fav, setFav] = useRecoilState(favorCampaignListState);

  // Dday 계산
  useEffect(() => {
    let endDate = dayjs(campaign.recruit_end_date);
    let now = dayjs();
    setDday(endDate.diff(now, "d"));
  }, []);

  useEffect(() => {
    setLike(favorList.includes(campaign.campaign_seq));
  }, [favorList]);

  // 포인트 콤마 찍는 함수
  const numberWithCommas = (x: number | string) => {
    return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleRoute = () => {
    // 캠페인 조회수 증가
    AxiosManager.patch("/campaigns/campaign/view-count", {
      campaign_seq: campaign.campaign_seq,
    });
    router.push(`/product/${campaign.campaign_seq}`);
  };

  // 캠페인 찜, 취소 부분
  const handleLike = async () => {
    if (!user?.user_seq) return alert("로그인 후 이용가능합니다");
    if (like) {
      const r = await AxiosManager.delete(`/users/interest-campaign`, {
        user_seq: user?.user_seq,
        campaign_seq: campaign.campaign_seq,
      });
    } else {
      const r = AxiosManager.post(`/users/interest-campaign`, {
        user_seq: user?.user_seq,
        campaign_seq: campaign.campaign_seq,
      });
    }
    const f = await AxiosManager.get("/users/interest-campaign", {
      user_seq: user?.user_seq,
    });
    setFav(f.data.interestCampaign);
  };

  return (
    <div>
      <div className="tw-max-w-[260px] tw-m-auto tw-cursor-pointer tw-relative">
        {/*{dday < 0 && (*/}
        {/*  <div*/}
        {/*    className={*/}
        {/*      "tw-absolute tw-top-0 tw-bottom-0 tw-left-0 tw-right-0 tw-bg-black tw-opacity-[.3] tw-z-[9999] tw-flex tw-justify-center tw-items-center tw-text-white tw-text-xl"*/}
        {/*    }*/}
        {/*  >*/}
        {/*    마감되었습니다*/}
        {/*  </div>*/}
        {/*)}*/}
        {/* Image & heart */}
        <div className="tw-mb-2">
          <div className="tw-relative tw-w-[100%] tw-h-[280px] card-image tw-overflow-hidden">
            <img
              src={
                campaign.campaign_file.length > 0
                  ? campaign.campaign_file.filter((f) =>
                      /thumbnail/g.test(f.name)
                    )[0].path
                  : ""
              }
              alt="campain-image"
              className={"tw-w-[100%] tw-h-[100%] tw-object-cover"}
              onClick={() => handleRoute()}
            />
            <div className="tw-z-[1000] tw-absolute tw-bottom-0 tw-right-0 tw-bg-white">
              <div
                className="tw-relative tw-w-[40px] tw-h-[40px]"
                onClick={() => handleLike()}
              >
                <Image
                  src={`/images/${like ? "하트찜선택.png" : "하트찜.png"}`}
                  layout="fill"
                  alt="heart"
                />
              </div>
            </div>
          </div>
        </div>
        {/* description */}
        <div
          className="tw-flex tw-items-end tw-mb-1"
          onClick={() => handleRoute()}
        >
          <span className="card-review-text">
            <Link href={`/product/${campaign.campaign_seq}`}>구매평</Link>
          </span>
          <Badge bg="light" text="secondary" className={"tw-rounded-[0px]"}>
            {campaign.category}
          </Badge>
          <Badge
            bg="laon-button"
            className={"!tw-rounded-[0px] !tw-font-normal"}
          >
            {numberWithCommas(campaign.accrual_point)}P
          </Badge>
        </div>
        <div
          className="tw-border-b-[1px] tw-border-gray-300 tw-pb-1"
          onClick={() => handleRoute()}
        >
          <h5 className="tw-text-sm tw-m-0 tw-font-bold">
            {campaign.title.length > 20
              ? campaign.title.slice(0, 20) + "..."
              : campaign.title}
          </h5>
          <h5 className="tw-text-sm tw-m-0 tw-text-gray-500">
            {campaign.campaign_guide.length > 20
              ? campaign.campaign_guide.slice(0, 18) + "..."
              : campaign.campaign_guide}
          </h5>
          <h5 className="tw-text-sm tw-m-0 tw-text-blue-500">
            {campaign.reward.length > 20
              ? campaign.reward.slice(0, 20) + "..."
              : campaign.reward}
          </h5>
        </div>
        <div className="tw-text-sm tw-mb-1">
          <span className="card-price-sale tw-mr-2">
            {numberWithCommas(campaign.original_price)}원
          </span>
          <span className="tw-text-[#334989] tw-font-semibold">
            {numberWithCommas(campaign.discount_price)} 원
          </span>
        </div>
        <div className="tw-flex tw-justify-between tw-bg-slate-100 tw-px-2 tw-py-[2px] tw-text-sm">
          <div className="tw-text-red-400">
            <div className={"tw-flex tw-items-center"}>
              <span
                className={
                  "tw-bg-red-500 tw-text-white tw-rounded-full tw-px-1 tw-mr-1 !tw-w-[17px] !tw-h-[17px] tw-inline-block tw-flex tw-items-center "
                }
              >
                D
              </span>
              <span>
                {" "}
                {dday == 0
                  ? "DAY"
                  : `${
                      dday < 0 ? `+ ${Math.abs(dday)}` : `- ${Math.abs(dday)}`
                    }일`}
              </span>
            </div>
          </div>
          {campaign.status ? (
            <div className={"tw-text-blue-500 tw-text-bold"}>
              {campaign.status === 1 ? "선정됨" : "완료"}
            </div>
          ) : (
            <div>
              {dday >= 0 ? (
                <>
                  <span className="tw-text-red-400">
                    {campaign.applicant_count}명 신청
                  </span>
                  <span className="tw-text-gray-400">
                    / {campaign.headcount}명 모집
                  </span>
                </>
              ) : (
                <>
                  {dayjs().diff(dayjs(campaign.campaign_end_date, "d")) > 0 ? (
                    <span className="tw-text-red-500 tw-font-bold">
                      캠페인 종료
                    </span>
                  ) : (
                    <span className="tw-text-primary tw-font-bold">
                      모집마감
                    </span>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardBox;
