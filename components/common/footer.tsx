import React from "react";
import { Col, Row } from "react-bootstrap";
import TextLinkButton from "./TextLinkButton";
import Layout from "./layout";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { userState } from "../../recoil/atoms/userAtom";
import { useRouter } from "next/router";

interface FooterProps {}

const Footer: React.FC<FooterProps> = ({ children }) => {
  const [user, setUser] = useRecoilState(userState);
  const router = useRouter();

  return (
    <>
      <Layout className="tw-border-b-2 tw-border-purple-300">
        <Row className="tw-py-3">
          <div className="tw-flex tw-justify-around">
            <TextLinkButton url={"/intro"}>
              라온디어스 체험단 소개
            </TextLinkButton>
            <TextLinkButton url={"/termofuse"}>이용약관</TextLinkButton>
            <TextLinkButton url={"/privacypolicy"}>
              개인정보처리방침
            </TextLinkButton>
            <TextLinkButton url={"/emailpolicy"}>
              이메일 주소 무단 수집거부
            </TextLinkButton>
            <TextLinkButton
              onClick={() => {
                if (!user?.user_seq) return alert("로그인 후 이용가능합니다");
                router.push("/mypage/query");
              }}
            >
              고객센터
            </TextLinkButton>
            <TextLinkButton url={"/adQuery"}>광고문의</TextLinkButton>
          </div>
        </Row>
      </Layout>
      <Layout>
        <Row>
          <Col>
            <div className="tw-flex tw-justify-around tw-mt-5">
              <div className="tw-flex tw-gap-10 tw-items-center">
                <div className="tw-relative tw-w-[120px] tw-h-[100px] ">
                  <Image src="/images/gray_logo.png" alt="logo" layout="fill" />
                </div>
                <div>
                  <div>상호명 : 라온디어스 체험단</div>
                  <div>대표이사 : 정지영</div>
                  <div>
                    주소 : 대구 동구 동대구로 469 대구콘텐츠비즈니스센터 306호
                  </div>
                  <div>사업자번호 : 230-88-02024</div>
                  <div>개인정보책임자 : 정지영</div>
                  <div>Copyright ⓒ (주)라온디어스 ALL RIGHT RESERVED</div>
                </div>
              </div>
              <div>
                <h5>고객센터</h5>
                <h2>053-217-4454</h2>
                <div>평일 AM 08:00 ~ PM 05:00</div>
                <div>점심시간 PM 12:00 ~ PM 01:00 (주말 및 공휴일 휴무)</div>
              </div>
            </div>
          </Col>
        </Row>
      </Layout>
    </>
  );
};

export default Footer;
