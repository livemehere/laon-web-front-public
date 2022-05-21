import React, { useEffect } from "react";
import Header from "../components/common/header";
import Layout from "../components/common/layout";
import { Col, Row } from "react-bootstrap";
import Image from "next/image";
import Footer from "../components/common/footer";
import Head from "next/head";
import AdQueryWrap from "../components/adQuery/adQuery";
import { useRecoilState } from "recoil";
import { filterIsOpenState } from "../recoil/atoms/filterIsOpenState";

interface Props {}

const Intro: React.FC<Props> = ({}) => {
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
            src="/images/intro/intro_bg.svg"
            alt="bg"
            className={"tw-w-[100%]"}
          />
          <div className={"inset-center"}>
            <img
              src="/images/intro/intro_img.png"
              alt=""
              className={"tw-inline-block"}
            />
          </div>
        </div>
        <div className={"tw-text-center tw-bg-[#fafafa] tw-pt-[6rem]"}>
          <img
            src="/images/intro/intro_1.png"
            alt="intro"
            className={"tw-m-auto tw-scale-75"}
          />
        </div>
        <div
          className={
            "tw-text-center tw-bg-[#fafafa] tw-pt-[6rem] tw-bg-[#f4fdff]"
          }
        >
          <img
            src="/images/intro/intro_2.png"
            alt="intro"
            className={"tw-m-auto tw-scale-75"}
          />
        </div>
        <div className={"tw-text-center tw-bg-[#fafafa] tw-pt-[6rem]"}>
          <img
            src="/images/intro/intro_3.png"
            alt="intro"
            className={"tw-m-auto tw-scale-75"}
          />
        </div>
        <div
          className={
            "tw-text-center tw-bg-[#fafafa] tw-pt-[6rem] tw-bg-[#f1fff8]"
          }
        >
          <img
            src="/images/intro/intro_4.png"
            alt="intro"
            className={"tw-m-auto tw-scale-75"}
          />
        </div>
        <div
          className={
            "tw-text-center tw-bg-[#fafafa] tw-pt-[6rem] tw-bg-[url('/images/intro/intro_5_bg.svg')] tw-bg-cover"
          }
        >
          <img
            src="/images/intro/intro_5.png"
            alt="intro"
            className={"tw-m-auto tw-scale-75"}
          />
        </div>
        <div>
          <AdQueryWrap />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Intro;
