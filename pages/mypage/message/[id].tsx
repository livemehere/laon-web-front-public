import React from "react";
import Link from "next/link";
import Head from "next/head";
import MyPageWrap from "../../../components/mypage/myPage";
import NoticeDetailWrap from "../../../components/notice/noticeDetailWrap";
import MessageDetailWrap from "../../../components/message/messageDetailWrap";

interface Props {}

const NoticeDetail: React.FC = ({}: Props) => {
  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 공지사항</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MyPageWrap content={<MessageDetailWrap />} />
    </>
  );
};

export default NoticeDetail;
