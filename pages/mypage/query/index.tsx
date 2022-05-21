import React, { useEffect } from "react";
import Head from "next/head";
import MyPageWrap from "../../../components/mypage/myPage";
import MyPageContent from "../../../components/mypage/mypageContent";
import QueryContent from "../../../components/mypage/query/queryContent";
import { useRecoilState } from "recoil";
import { filterIsOpenState } from "../../../recoil/atoms/filterIsOpenState";

interface Props {}

const Index: React.FC = ({}: Props) => {
  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 문의하기</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MyPageWrap content={<QueryContent />} />
    </>
  );
};

export default Index;
