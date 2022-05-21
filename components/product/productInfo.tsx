import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import BlogBadge from "../common/badges/blogBadge";
import DeliverBadge from "../common/badges/deliverBadge";
import Image from "next/image";
import CheckLabel from "../common/checkLabel";
import { useRouter } from "next/router";
import useInput from "../../hooks/useInput";
import { CampaignType } from "../../recoil/atoms/campaign";
import dayjs from "dayjs";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../../recoil/atoms/userAtom";
import { favorCampaignListState } from "../../recoil/atoms/favorCampaign";
import AxiosManager from "../../util/axiosManager";

interface Props {
  campaign: CampaignType;
}

const ProductInfo: React.FC<Props> = ({ campaign }) => {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const [like, setLike] = useState(false);
  const [fav, setFav] = useRecoilState(favorCampaignListState);
  const [favorCamp, setFavorCamp] = useRecoilState(favorCampaignListState);
  const [favorList, setFavorList] = useState<number[]>([]);

  useEffect(() => {
    const favorCampSeqList = favorCamp.map((f) => f.campaign_seq);
    setFavorList(favorCampSeqList);
  }, [favorCamp]);

  useEffect(() => {
    setLike(favorList.includes(campaign.campaign_seq));
  }, [favorList]);

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

  const { input, handleChange } = useInput({
    face_policy: 0,
    campain_policy: 0,
  });

  const handleApply = () => {
    if (user === null) {
      alert("로그인 후 이용 가능합니다.");
      return router.push("/signin");
    }

    if (input.campain_policy === 1) {
      router.push(`/product/apply/${campaign.campaign_seq}`);
    } else {
      alert("동의 항목을 체크해주세요");
    }
  };

  return (
    <div className={"tw-flex tw-p-5 tw-gap-6 tw-mt-10"}>
      <div className={" tw-flex-1"}>
        <div className={"tw-w-[500px] tw-h-[535px] tw-float-right"}>
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
          />
        </div>
      </div>
      <div className={"product_info tw-flex-1"}>
        <Row>
          <Col>
            <h3>{campaign.title}</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <BlogBadge />
            <DeliverBadge />
          </Col>
        </Row>
        <Row className={"divide_bottom"}>
          <Col>모집인원</Col>
          <Col>{campaign.headcount}명</Col>
        </Row>
        <Row className={"divide_bottom"}>
          <Col>제공내역</Col>
          <Col>{campaign.reward}</Col>
        </Row>
        <Row className={"divide_bottom"}>
          <Col>모집기간</Col>
          <Col>
            {dayjs(campaign.recruit_start_date).format("YYYY.MM.DD")} ~
            {dayjs(campaign.recruit_end_date).format("YYYY.MM.DD")}
          </Col>
        </Row>
        <Row className={"divide_bottom"}>
          <Col>리뷰어발표</Col>
          <Col>
            {dayjs(campaign.reviewer_announcement_date).format("YYYY.MM.DD")}
          </Col>
        </Row>
        <Row className={"divide_bottom"}>
          <Col>리뷰어등록기간</Col>
          <Col>
            {dayjs(campaign.review_start_date).format("YYYY.MM.DD")} ~{" "}
            {dayjs(campaign.review_end_date).format("YYYY.MM.DD")}
          </Col>
        </Row>
        <Row className={"divide_bottom"}>
          <Col>캠페인마감</Col>
          <Col>{dayjs(campaign.campaign_end_date).format("YYYY.MM.DD")}</Col>
        </Row>
        <Row>
          <div className={"tw-pt-9"}>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={input?.campain_policy === 1}
                  onChange={(e) =>
                    handleChange("campain_policy", e.target.checked ? 1 : 0)
                  }
                />
                <span className={`tw-text-gray-500 tw-pl-2`}>
                  캠페인 유의사항 및 제 3자 제공에 모두 동의합니다.
                </span>
              </label>
            </div>
          </div>
          <div className={"tw-flex tw-gap-1 !tw-pl-1 !tw-mt-4"}>
            <button
              className={
                "tw-px-[7em] tw-py-3 tw-bg-primary tw-text-white " +
                `${
                  dayjs().diff(dayjs(campaign.recruit_end_date)) > 0 &&
                  "!tw-bg-gray-400"
                }`
              }
              onClick={() => handleApply()}
              disabled={
                dayjs().diff(dayjs(campaign.recruit_end_date)) > 0 ||
                dayjs().diff(dayjs(campaign.recruit_start_date)) < 0
              }
            >
              캠페인 신청하기
            </button>
            <div
              className="tw-relative tw-w-[50px] tw-h-[50px] tw-cursor-pointer"
              onClick={() => handleLike()}
            >
              <Image
                src={`/images/${like ? "하트찜선택.png" : "하트찜.png"}`}
                layout="fill"
                alt="heart"
              />
            </div>
          </div>
        </Row>
      </div>
    </div>
  );
};

export default ProductInfo;
