import React from "react";
import Head from "next/head";
import Header from "../../../components/common/header";
import Footer from "../../../components/common/footer";
import Layout from "../../../components/common/layout";
import ProductApplyWrap from "../../../components/product/apply";
import { GetServerSideProps } from "next";
import AxiosManager from "../../../util/axiosManager";
import { CampaignType } from "../../../recoil/atoms/campaign";

interface Props {
  campaign: CampaignType;
}

const ProducApply: React.FC<Props> = ({ campaign }) => {
  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 캠페인</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Header />
        <Layout>
          <ProductApplyWrap campaign={campaign} />
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

export default ProducApply;
