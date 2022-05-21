import React from "react";
import Link from "next/link";
import Head from "next/head";
import MyPageWrap from "../../../components/mypage/myPage";
import NoticeDetailWrap from "../../../components/notice/noticeDetailWrap";
import { GetServerSideProps } from "next";
import AxiosManager from "../../../util/axiosManager";
import { NoticeType } from "../../../recoil/atoms/notice";

interface Props {
  n: NoticeType;
}

const NoticeDetail: React.FC<Props> = ({ n }) => {
  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 공지사항</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MyPageWrap content={<NoticeDetailWrap n={n} />} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const seq = context.query.id;
  const n = await AxiosManager.get(`/notice/detail?notice_seq=${seq}`);

  return {
    props: { n: n.data.data[0] },
  };
};

export default NoticeDetail;
