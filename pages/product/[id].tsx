import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/common/header";
import Footer from "../../components/common/footer";
import Layout from "../../components/common/layout";
import { Tab, Tabs } from "react-bootstrap";
import ProductInfo from "../../components/product/productInfo";
import InfoTab from "../../components/product/infoTab";
import ReviewerList from "../../components/product/reviewerList";
import AxiosManager from "../../util/axiosManager";
import { GetServerSideProps } from "next";
import { CampaignType } from "../../recoil/atoms/campaign";
import { useRecoilState } from "recoil";
import { favorCampaignListState } from "../../recoil/atoms/favorCampaign";
import { userState } from "../../recoil/atoms/userAtom";
import CardList from "../../components/common/cardList";
import Script from "next/script";
import dayjs from "dayjs";

interface Props {
  campaign: CampaignType;
}

export interface MyCampaignType {
  accrual_point: number;
  acquaint_content: number;
  address: string;
  advertiser: number;
  agreement_portrait: number;
  agreement_provide_info: number;
  area: string;
  camera_code: string;
  campaign_end_date: string;
  campaign_file: any[];
  campaign_guide: string;
  campaign_seq: number;
  campaign_state: number;
  category: string;
  channel: string;
  discount_price: number;
  face_exposure: number;
  headcount: number;
  is_premium: number;
  joint_blog: number;
  keyword: string;
  misson: string;
  original_price: number;
  other_answers: string;
  product: string;
  receiver: string;
  receiver_phonenumber: string;
  recruit_end_date: string;
  recruit_start_date: string;
  review_end_date: string;
  review_start_date: string;
  reviewer_announcement_date: string;
  reward: string;
  select_reward: string;
  siteURL: string;
  status: number;
  title: string;
  user_seq: number;
  view_count: number;
}

const ProductDetail: React.FC<Props> = ({ campaign }) => {
  const [relativeCamp, setRelativeCamp] = useState<CampaignType[]>([]);
  // const [blackCampApply, setBlackCampApply] = useState(false);
  const getRelativeCamp = async () => {
    const r = await AxiosManager.get("/campaigns/relation", {
      product: campaign.product,
    });
    if (r.status === 200) {
      setRelativeCamp(
        r.data.campaigns.filter(
          (c: CampaignType) => c.campaign_seq !== campaign.campaign_seq
        )
      );
    }
  };

  // const [user, setUser] = useRecoilState(userState);
  //
  // const getMyCamp = async () => {
  //   const r = await AxiosManager.get(`/users/my-campaign`, {
  //     user_seq: user?.user_seq,
  //   });
  //
  //   if (r.status === 200) {
  //     const myCamps: MyCampaignType[] = r.data.myCampaign;
  //     myCamps.some((m) => {
  //       const isDoing = m.status === 1;
  //       const isOverTimeToReview =
  //         dayjs().diff(dayjs(m.review_end_date, "d")) > 0;
  //       console.log(isDoing, isOverTimeToReview);
  //       if (isDoing && isOverTimeToReview) {
  //         console.log("block");
  //         setBlackCampApply(true);
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     });
  //   }
  // };

  // useEffect(() => {
  //   if (!user) return;
  //   getMyCamp();
  // }, [user]);

  useEffect(() => {
    getRelativeCamp();
  }, [campaign]);

  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 캠페인 상세페이지</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.naverClientKey}`}
        strategy={"beforeInteractive"}
      />
      <>
        <Header />
        <Layout>
          {/*  img and info */}
          <ProductInfo campaign={campaign} />
          <Tabs defaultActiveKey="info" className="mb-3 tw-mt-10">
            <Tab eventKey="info" title="캠페인정보">
              <InfoTab campaign={campaign} />
            </Tab>
            <Tab eventKey="detail" title="상세페이지">
              <img
                src={
                  campaign.campaign_file.length > 0
                    ? campaign.campaign_file.filter((f) =>
                        /detail/g.test(f.name)
                      )[0].path
                    : ""
                }
                alt="campain-image"
                className={"tw-w-[80%] tw-object-contain tw-m-auto"}
              />
            </Tab>
            <Tab
              eventKey="apply"
              title={`신청한 리뷰어(${campaign.applicant_count}/${campaign.headcount})`}
            >
              <h3 className={"tw-mt-10"}>캠페인 신청자 리스트</h3>
              <ReviewerList campaign={campaign} isSelected={false} />
            </Tab>
            <Tab
              eventKey="selected"
              title={`선정된 리뷰어(${
                campaign.applicant.filter((a) =>
                  a.status === 1 ? true : false
                ).length
              })`}
            >
              <h3 className={"tw-mt-10"}>선정된 리뷰어</h3>
              <ReviewerList campaign={campaign} isSelected={true} />
            </Tab>
          </Tabs>
        </Layout>
        <Layout className={"tw-bg-[#F4F4F4] tw-py-5"}>
          <div>
            <h4>연관 캠페인</h4>
            <CardList col={4} isFilter={false} data={relativeCamp} />
          </div>
        </Layout>
        <Footer />
      </>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id;
  const result = await AxiosManager.get("/campaigns", {
    campaign_seq: id,
  });

  return {
    props: { campaign: result.data.campaign },
  };
};

export default ProductDetail;
