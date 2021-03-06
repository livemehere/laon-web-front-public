import React, { ChangeEvent, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Button from "../common/Button";
import Input from "../common/input";
import Image from "next/image";
import Layout from "../common/layout";
import TextLinkButton from "../common/TextLinkButton";
import CheckLabel from "../common/checkLabel";
import { useRecoilState } from "recoil";
import { userState, UserType } from "../../recoil/atoms/userAtom";
import useInput from "../../hooks/useInput";
import { useRouter } from "next/router";
import AxiosManager from "../../util/axiosManager";
import { addressState } from "../../recoil/atoms/addressAtom";
import axios from "axios";
import NaverLoginButton from "./naverLoginButton";
import Link from "next/link";

interface SignInWrapProps {}

interface NaverLoginDataType {
  age?: string;
  birthday?: string;
  birthyear?: string;
  email?: string;
  gender?: string;
  id: string;
  mobile: string;
  mobile_e164?: string;
  name?: string;
  nickname?: string;
  profile_image?: string;
}

interface KakaoLoginDataType {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  token_type: "bearer";
}

interface SignInType {
  email: string;
  password: string;
  is_autoLogin: boolean;
}

const SignInWrap: React.FC<SignInWrapProps> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const [address, setAddress] = useRecoilState(addressState);

  const { input, handleChange } = useInput<SignInType>({
    email: "",
    password: "",
    is_autoLogin: false,
  });

  const saveTokenIntoLocalStorage = (
    accessToken: string,
    refreshToken: string
  ) => {
    window.localStorage.setItem("accessToken", accessToken);
    window.localStorage.setItem("refreshToken", refreshToken);
  };

  const handleLogin = async () => {
    const result = await AxiosManager.post("/auth/login", {
      user_id: input.email,
      user_password: input.password,
    });

    if (result.status === 200) {
      // ????????? ????????????
      const addressResult = await AxiosManager.get("/users/address", {
        user_seq: result.data.user.user_seq,
      });

      setUser(result.data.user); // ???????????? ??????
      setAddress(addressResult.data.addressBook); // ????????? ??????
      saveTokenIntoLocalStorage(
        result.data.data.accessToken,
        result.data.data.refreshToken
      );
      router.push("/");
    } else {
      alert("????????? ?????? ??????????????? ???????????????");
    }
  };

  useEffect(() => {
    const p = router.query;
    if (!p.code) return;
    kakaoLogin(p.code as string);
  }, [router]);

  const handleKaKaoLogin = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.kakaoClientId}&redirect_uri=${process.env.redirectURL}`;
  };

  const kakaoLogin = async (code: string) => {
    // ?????? ??????
    const r = await axios.post(
      `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.kakaoClientId}&redirect_uri=${process.env.redirectURL}&code=${code}`,
      {},
      {
        headers: {
          "Content-type": " application/x-www-form-urlencoded",
        },
      }
    );
    console.log(r);
    if (r.status !== 200) return alert("????????? ????????? ?????? ??????");
    const kakaoLoginData: KakaoLoginDataType = r.data;
    const signInResult = await axios.post(
      `${process.env.serverURL}/auth/login/kakao`,
      {},
      {
        headers: {
          Authorization: `Bearer ${kakaoLoginData.access_token}`,
        },
      }
    );

    if (signInResult.status === 200) {
      const { accessToken, refreshToken } = signInResult.data.data;
      setUser(signInResult.data.user);
      saveTokenIntoLocalStorage(accessToken, refreshToken);
      window.localStorage.setItem("is_sns", "true");
      router.push("/");
    } else {
      alert("????????? ????????? ??????????????? ?????????????????????.");
    }
  };

  const initializeNaverLogin = () => {
    const naver_id_login = new window.naver_id_login(
      process.env.naverDeveloperClientKey,
      `${process.env.redirectURL}`
    );

    const state = naver_id_login.getUniqState();
    naver_id_login.setButton("white", 2, 40);
    naver_id_login.setDomain(process.env.naverRedirectURL);
    naver_id_login.setState(state);
    naver_id_login.init_naver_id_login();

    if (!naver_id_login.oauthParams.access_token) return;
    getNaverToken();
  };
  useEffect(() => {
    initializeNaverLogin();
  }, []);

  const getNaverToken = async () => {
    if (!location.hash) return;
    const token = location.hash.split("=")[1].split("&")[0];
    if (token) {
      const r = await axios.post("/api/naverLogin", {
        token,
      });
      if (r.status === 200) {
        const naverUser: NaverLoginDataType = r.data.response;
        const loginResult = await AxiosManager.post("/auth/login/naver", {
          id: naverUser.id,
          name: naverUser.name,
          email: naverUser.email,
          gender: naverUser.gender === "M" ? "m" : "f",
          mobile: naverUser.mobile.replaceAll("-", ""),
          birthyear: naverUser.birthyear,
          profile_image: naverUser.profile_image,
        });
        if (loginResult.status === 200) {
          setUser(loginResult.data.user);
          saveTokenIntoLocalStorage(
            loginResult.data.data.accessToken,
            loginResult.data.data.refreshToken
          );
          window.localStorage.setItem("is_sns", "true");
          router.push("/");
        }
      }
    }
  };

  return (
    <>
      <Layout className="tw-max-w-[400px] tw-m-auto">
        <Row>
          <Col>
            <Link href={"/"}>
              <div className="tw-relative tw-w-[180px] tw-h-[150px] tw-m-auto tw-mt-5 tw-cursor-pointer">
                <Image src="/images/????????????.png" layout="fill" alt="logo" />
              </div>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col>
            <input
              type="text"
              placeholder="?????????"
              value={input?.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <input
              type="password"
              placeholder="????????????"
              value={input?.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
            />
          </Col>
        </Row>
        <Row className="tw-my-2">
          <Col>
            <Button
              text="?????????"
              bgColor="tw-bg-primary"
              onClick={handleLogin}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <label>
              <input
                type="checkbox"
                checked={input.is_autoLogin}
                onChange={(e) => handleChange("is_autoLogin", e.target.checked)}
              />
              <span className={`tw-text-gray-500 `}>???????????????</span>
            </label>
          </Col>
          <Col className="tw-flex tw-justify-end tw-text-gray-500 tw-my-8">
            <button>?????????/???????????? ??????</button>
          </Col>
        </Row>
        <Row className="tw-mb-1">
          <Col>
            <button
              className={
                "tw-border-[1px] tw-border-primary tw-w-[100%] tw-py-2"
              }
              onClick={() => router.push("/signup")}
            >
              ????????????
            </button>
          </Col>
        </Row>
        <Row className="tw-mb-1">
          <Col>
            <NaverLoginButton />
          </Col>
          <Col>
            <div
              className={"tw-cursor-pointer"}
              onClick={() => handleKaKaoLogin()}
            >
              <img src="/images/kakao/kakao-login.png" alt="kako-btn" />
            </div>
          </Col>
        </Row>
      </Layout>
      <Row className="tw-my-5 tw-pt-2 ">
        <div className="tw-divide-x-[1px] tw-flex tw-justify-center tw-text-sm">
          <TextLinkButton url={"/intro"}>??????????????? ????????? ??????</TextLinkButton>
          <TextLinkButton url={"/termofuse"}>????????????</TextLinkButton>
          <TextLinkButton url={"/privacypolicy"}>
            ????????????????????????
          </TextLinkButton>
          <TextLinkButton url={"/emailpolicy"}>????????????</TextLinkButton>
          <TextLinkButton url={"/"}>????????????</TextLinkButton>
        </div>
      </Row>
      <Layout>
        <Row>
          <Col>
            <p className="tw-text-center tw-text-primary tw-text-sm">
              COPYRIGHT ?? (???)??????????????? ALL RIGHT RESERVED
            </p>
          </Col>
        </Row>
      </Layout>
    </>
  );
};

export default SignInWrap;
