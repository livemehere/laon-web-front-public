import React from "react";
import Head from "next/head";
import MyPageWrap from "../../../components/mypage/myPage";
import QueryWriteWrap from "../../../components/mypage/query/queryWriteWrap";

interface Props {}

const AttendenceWrite: React.FC = ({}: Props) => {
  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 출석부</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MyPageWrap content={<QueryWriteWrap />} />
    </>
  );
};

export default AttendenceWrite;
