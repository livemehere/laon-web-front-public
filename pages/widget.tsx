import React, { MouseEventHandler, useEffect, useRef } from "react";
import Header from "../components/common/header";
import Footer from "../components/common/footer";
import Layout from "../components/common/layout";
import Image from "next/image";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import Button from "../components/common/Button";
import { useRecoilState } from "recoil";
import { filterIsOpenState } from "../recoil/atoms/filterIsOpenState";

interface WidgetProps {}

const Widget: React.FC<WidgetProps> = ({ children }) => {
  const codeRef = useRef<HTMLParagraphElement>(null);

  // const handleCopyCode: MouseEventHandler<HTMLButtonElement> = (e) => {
  //   const code = codeRef.current?.innerHTML!;
  //   navigator.clipboard.writeText(code).then(() => {
  //     alert("복사되었습니다");
  //   });
  // };

  return (
    <>
      <Header />
      <Layout>
        <Row>
          <Col>
            <div className="tw-relative tw-w-[1229px] tw-h-[2002px] tw-m-auto tw-mt-10">
              <Image
                src={"/images/선정높이는법.png"}
                layout="fill"
                alt="widget-gauid"
              />
            </div>
          </Col>
        </Row>
        <Row className="tw-justify-center">
          <Col>
            <p
              ref={codeRef}
              className="tw-border-2 tw-border-blue-500 tw-w-[1000px] tw-m-auto tw-my-8 tw-p-4"
            >
              {`<a
            href="https://www.laondeas.co.kr/"
            target="_blank"
          >
            <img
              src="https://laondius.s3.ap-northeast-2.amazonaws.com/commonfile/widget_1652305405528laon-widget.png"
              width="170"
              height="170"
            />
          </a>`}
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className=" tw-mt-10">
              <img
                src={"/images/widgetDetail.png"}
                alt="widget-gauid"
                className={"tw-m-auto"}
              />
            </div>
          </Col>
        </Row>
      </Layout>
      <Footer />
    </>
  );
};

export default Widget;
