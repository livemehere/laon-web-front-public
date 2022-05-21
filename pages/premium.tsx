import React, { useEffect } from "react";
import Head from "next/head";
import Header from "../components/common/header";
import Footer from "../components/common/footer";
import { useRecoilState } from "recoil";
import { filterIsOpenState } from "../recoil/atoms/filterIsOpenState";

interface Props {}

const Premium: React.FC<Props> = ({}) => {
  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 홈</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div>
        <div className={"tw-relative"}>
          <img
            src="/images/premium/premium_bg.svg"
            alt="bg"
            className={"tw-w-[100%]"}
          />
          <div className={"inset-center"}>
            <h1 className={"premium_title !tw-text-center"}>
              라온디어스 체험단 프리미엄
            </h1>
            <h2 className={"premium_sub_title !tw-text-center"}>
              laondeas experience group premium
            </h2>
            <p className={"premium_list !tw-text-center"}>
              naver blog premium i naver influencer premium i instagram premium
              i youtube premium
            </p>
          </div>
        </div>
        <div className={"tw-text-center tw-bg-[#fafafa] tw-pt-[6rem]"}>
          <p className={"tw-mb-3 tw-text-[2.5rem]"}>
            <span className={"tw-font-bold"}>라온디어스 체험단 프리미엄</span>
            이란?
          </p>
          <p className={"tw-w-[60%] tw-m-auto tw-mb-8 tw-max-w-[887px]"}>
            라온디어스 체험단 프리미엄은 기존 캠페인에서 한 단계 나아가,
            전문성과 영향력이 검증된 회원들을 위한 캠페인 프로그램입니다.
            블로거와 네이버 인플루언서, 인스타그래머와 유튜버까지 다양하게
            신청가능한 라온디어스 프리미엄을 만나보세요.
          </p>
          <img
            src="/images/premium/premium_card_list.png"
            alt="card"
            className={"tw-m-auto"}
          />
        </div>
        <div className={"tw-text-center tw-pt-[6rem]"}>
          <img
            src="/images/premium/premium_inspect.png"
            alt="card list"
            className={"tw-m-auto tw-mb-8"}
          />
          <p className={"tw-w-[53%] tw-max-w-[887px] tw-m-auto tw-mb-8"}>
            더 많은 인플루언서들이 각자의 주력 미디어에 맞춰 신청가능하도록
            프리미엄 종류가 4가지로 확대되었습니다. 모든 프리미엄은 라온디어스
            체험단 내부 심사를 거치게 되며, 콘텐츠의 퀄리티와 미디어 영향력 등을
            심사합니다.
          </p>
          <img
            src="/images/premium/premium_sns_list.png"
            alt="list"
            className={"tw-m-auto tw-mb-8"}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Premium;
