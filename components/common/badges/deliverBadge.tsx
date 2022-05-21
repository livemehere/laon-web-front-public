import React from "react";
import { Badge } from "react-bootstrap";

interface Props {}

const DeliverBadge: React.FC<Props> = ({}) => {
  return (
    <Badge bg="light" text="secondary" className={"tw-rounded-[0px]"}>
      배송형
    </Badge>
  );
};

export default DeliverBadge;
