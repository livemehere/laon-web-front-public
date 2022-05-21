import React from "react";
import { Col, Row } from "react-bootstrap";

interface Props {
  headers: string[];
}

const JustDisplayTable: React.FC<Props> = ({ headers }: Props) => {
  return (
    <div>
      <Row
        className={"tw-bg-gray-200 tw-border-y-[1px] tw-border-gray-300 tw-p-1"}
      >
        {headers.map((h, idx) => (
          <Col key={idx} className={"tw-text-center"}>
            {h}
          </Col>
        ))}
      </Row>
      <Row className={"tw-border-b-[1px] tw-border-gray-300 tw-text-[.8em]"}>
        <Col className={"tw-text-center"}>캠페인 선정 및 진행시 사용</Col>
        <Col className={"tw-text-center"}>
          이름, 생년월일, 성별, 휴대전화번호, 주소, 미디어
        </Col>
        <Col className={"tw-text-center"}>회원탈퇴시까지</Col>
      </Row>
    </div>
  );
};

export default JustDisplayTable;
