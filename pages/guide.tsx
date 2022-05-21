import React, { useEffect } from "react";
import Head from "next/head";
import GuideWrap from "../components/guide/guideWrap";
import MyPageWrap from "../components/mypage/myPage";
import { useRecoilState } from "recoil";
import { filterIsOpenState } from "../recoil/atoms/filterIsOpenState";

interface Props {}

const Guide: React.FC = ({}: Props) => {
  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 가이드</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MyPageWrap content={<GuideWrap />} />
    </>
  );
};

export default Guide;
