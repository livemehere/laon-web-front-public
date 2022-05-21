import Head from "next/head";
import React from "react";
import SignUpWrap from "../components/signUp/signup";

interface SignUpProps {}

const SignUp: React.FC<SignUpProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 회원가입</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SignUpWrap />
    </>
  );
};

export default SignUp;
