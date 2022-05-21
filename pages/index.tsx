import type { NextPage } from "next";
import Head from "next/head";
import HomeWrap from "../components/home/home";
import AxiosManager from "../util/axiosManager";
import { GetServerSideProps } from "next";
import { CampaignType } from "../recoil/atoms/campaign";
import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useRecoilState } from "recoil";
import { userState } from "../recoil/atoms/userAtom";
import { addressState } from "../recoil/atoms/addressAtom";

const Home: NextPage = ({
  allCampaignList,
  total,
  notices,
}: CampaignType[] | any) => {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const [address, setAddress] = useRecoilState(addressState);

  const saveAddress = async () => {
    const addressResult = await AxiosManager.get("/users/address", {
      user_seq: user?.user_seq,
    });

    if (addressResult.status !== 200) return;
    setAddress(addressResult.data.addressBook); // 주소록 저장
  };

  useEffect(() => {
    if (!user) return;
    saveAddress();
  }, [user]);

  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 홈</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomeWrap
        allCampaignList={allCampaignList}
        total={total}
        notices={notices}
      />
    </>
  );
};

// 홈페이지 들어올시에 최초 모든 캠페인 데이터 가져오기
export const getServerSideProps: GetServerSideProps = async (context) => {
  const result = await AxiosManager.get("/campaigns/all");
  const notices = await AxiosManager.get("/notice");

  const allCampaignList: CampaignType[] = result.data.campaigns;
  const total: number = result.data.totalcount;
  return {
    props: { allCampaignList, total, notices: notices.data.data },
  };
};

export default Home;
