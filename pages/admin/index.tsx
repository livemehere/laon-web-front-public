import React, { useEffect } from "react";
import Head from "next/head";
import HomeWrap from "../../components/home/home";
import Header from "../../components/common/header";
import Banner from "../../components/home/banner";
import Counter from "../../components/home/counter";
import CardList from "../../components/common/cardList";
import Notice from "../../components/home/notice";
import Footer from "../../components/common/footer";
import Layout from "../../components/common/layout";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../../recoil/atoms/userAtom";
import { useRouter } from "next/router";
import AdminCard from "../../components/admin/card";
import { filterIsOpenState } from "../../recoil/atoms/filterIsOpenState";

interface Props {}

const AdminPage: React.FC<Props> = ({}) => {
  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 관리자 페이지</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Header />
        <Layout className="tw-mb-10">
          <div
            className={"tw-grid tw-grid-cols-4 tw-mt-10 tw-gap-4 tw-gap-y-10"}
          >
            <AdminCard
              title={"캠페인 생성"}
              desc={"새로운 캠페인을 생성합니다"}
              href={"/admin/campaign/new"}
            />
            <AdminCard
              title={"캠페인 관리"}
              desc={"수정, 삭제, 신청자확인"}
              href={"/admin/campaign/manage"}
            />
            <AdminCard
              title={"회원 관리"}
              desc={"조회 및 관리"}
              href={"/admin/user/manage"}
            />
            <AdminCard
              title={"공지사항 작성"}
              desc={"공지사항 작성"}
              href={"/admin/notice/new"}
            />
            <AdminCard
              title={"1대1 문의"}
              desc={"조희 & 답변"}
              href={"/admin/qna"}
            />
            <AdminCard
              title={"출금신청 내역"}
              desc={"출금신청 완료 및 반려 처리"}
              href={"/admin/withDrawalList"}
            />
            <AdminCard
              title={"프리미엄 신청 내역"}
              desc={"프리미엄 완료 및 반려 처리"}
              href={"/admin/premiumList"}
            />
            <AdminCard
              title={"블랙리스트 목록"}
              desc={"블랙리스트 조회 및 해제"}
              href={"/admin/user/blacklist"}
            />
            <AdminCard
              title={"광고신청 목록"}
              desc={"광고신청 목록 조회"}
              href={"/admin/advertisement"}
            />
          </div>
        </Layout>
        <Footer />
      </>
    </>
  );
};

export default AdminPage;
