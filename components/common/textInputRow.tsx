import React from "react";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";

interface TextInputRowProps {
  left: JSX.Element;
  right: JSX.Element;
  className?: string;
}

const TextInputRow: React.FC<TextInputRowProps> = ({
  children,
  left,
  right,
  className,
}) => {
  return (
    <Row>
      <Col xl="3" className={`tw-flex tw-items-center ${className}`}>
        {left}
      </Col>
      <Col>{right}</Col>
    </Row>
  );
};

export default TextInputRow;
