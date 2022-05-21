import Head from "next/head";
import React from "react";
import Footer from "../components/common/footer";
import Header from "../components/common/header";
import Layout from "../components/common/layout";

interface EmailPolicyProps {}

const EmailPolicy: React.FC<EmailPolicyProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 운영정책</title>
        <meta name="라온디어스 운영정책" content="라온디어스 운영정책" />
      </Head>
      <Header />
      <Layout>
        <div className="container__content-area tw-mb-[500px]">
          <h1 className="tw-text-center tw-my-10">운영정책</h1>
          <div className="tw-border-[1px] tw-border-black tw-p-5">
            <p>
              블로그체험단 라온디어스체험단은 정보통신망법 제 50조의 2, 제
              50조의 7등에 의거하여, 블로그체험단 라온디어스체험단이 운영,
              관리하는 웹페이지 상에서 이메일 주소 수집 프로그램이나 그 밖의
              기술적 장치 등을 이용하여 이메일 주소를 무단으로 수집하는 행위를
              거부합니다. 블로그체험단 라온디어스체험단의 동의 없이 영리 목적의
              광고성 정보를 게시하는 행위를 거부합니다. 이를 위반시
              정보통신망법에 의해 형사처벌됨을 유념하시기 바랍니다.{" "}
            </p>
            <p className="tw-mt-8">[ 게시일 2021년 08월 01일 ]</p>
          </div>
        </div>
      </Layout>
      <Footer />
    </>
  );
};

export default EmailPolicy;
