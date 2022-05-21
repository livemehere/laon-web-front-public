import Head from "next/head";
import React from "react";
import MyPageWrap from "../../components/mypage/myPage";
import MyCampain from "../../components/mypage/myCampain";

interface MyPageProps {}

const MyPage: React.FC<MyPageProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 마이페이지</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MyPageWrap content={<MyCampain />} />
    </>
  );
};

export default MyPage;
