import React from "react";
import Head from "next/head";
import MyPageWrap from "../../../components/mypage/myPage";
import MessageContent from "../../../components/message/messageContent";
import PointContent from "../../../components/mypage/point/pointContent";

interface Props {}

const Point: React.FC = ({}: Props) => {
  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 포인트</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MyPageWrap content={<PointContent />} />
    </>
  );
};

export default Point;
