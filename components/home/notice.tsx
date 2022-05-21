import Link from "next/link";
import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import NoticeBox from "../notice/noticeBox";
import NoticeIcon from "../common/noticeIcon";
import Layout from "../common/layout";
import { NoticeType } from "../../recoil/atoms/notice";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { userState } from "../../recoil/atoms/userAtom";
import { filterIsOpenState } from "../../recoil/atoms/filterIsOpenState";

interface NoticeProps {
  notices: NoticeType[];
}

const Notice: React.FC<NoticeProps> = ({ children, notices }) => {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const handleClick = (href: string) => {
    router.push(href);
  };

  const handleRouteToGuide = (href: string) => {
    if (!user?.user_seq) return alert("로그인 후 이용가능합니다");
    router.push(href);
  };
  return (
    <Layout className="tw-bg-gray-100">
      <Row className="tw-flex tw-gap-2 tw-p-5">
        <Col className="tw-flex tw-gap-3 tw-flex-col tw-items-center xl:tw-flex-row">
          <NoticeBox notices={notices} />
          <NoticeIcon
            src="/images/이용가이드.png"
            href="/guide"
            onClick={() => handleRouteToGuide("/guide")}
          />
          <NoticeIcon
            src="/images/라온디어스_위젯.png"
            href="/widget"
            onClick={() => handleClick("/widget")}
          />
          <NoticeIcon
            src="/images/회원가입.png"
            href="/signup"
            onClick={() => handleClick("/signup")}
          />
        </Col>
      </Row>
    </Layout>
  );
};

export default Notice;
