import React from "react";
import { Col, Row } from "react-bootstrap";
import CountBox from "./countBox";
import Layout from "../common/layout";

interface CounterProps {}

const Counter: React.FC<CounterProps> = ({ children }) => {
  return (
    <Layout>
      <Row className="tw-border-b-2 tw-border-bottom-black tw-pt-5 tw-pb-2 tw-mb-5">
        <Col>
          <CountBox text={"인플루언서"} value={2274} />
        </Col>
        <Col>
          <CountBox text={"체험단 총 팔로워"} value={477510} />
        </Col>
        <Col>
          <CountBox text={"진행된 프로젝트"} value={475} />
        </Col>
      </Row>
    </Layout>
  );
};

export default Counter;
