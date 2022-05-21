import React from "react";
import { Col, Row } from "react-bootstrap";

interface Props {
  headers: string[];
}

const Table: React.FC<Props> = ({ headers }: Props) => {
  return (
    <div>
      <Row className={"tw-bg-gray-100 tw-border-y-[1px] tw-border-gray-300"}>
        {headers.map((h, idx) => (
          <Col key={idx} className={"tw-text-center tw-p-1"}>
            {h}
          </Col>
        ))}
      </Row>
      <Row className={"tw-border-b-[1px] tw-border-gray-300"}>
        <div className={"tw-text-center hover:tw-bg-gray-100 cursor-pointer"}>
          + 배송지등록
        </div>
      </Row>
    </div>
  );
};

export default Table;
