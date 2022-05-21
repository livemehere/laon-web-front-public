import React from "react";
import Head from "next/head";
import MyPageWrap from "../../../components/mypage/myPage";
import MessageContent from "../../../components/message/messageContent";
import { GetServerSideProps } from "next";
import AxiosManager from "../../../util/axiosManager";

interface Props {}

const Message: React.FC = ({}: Props) => {
  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 메세지</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MyPageWrap content={<MessageContent />} />
    </>
  );
};

export default Message;
