import React from "react";
import { Accordion } from "react-bootstrap";
import { FAQType } from "./guideWrap";

interface Props {
  title: string;
  FAQList: FAQType[];
}

const FAQSection: React.FC<Props> = ({ FAQList, title }) => {
  return (
    <>
      <h4 className={"tw-mt-10"}>{title}</h4>
      <Accordion>
        {FAQList &&
          FAQList.map((n, idx) => (
            <Accordion.Item key={idx} eventKey={idx.toString()}>
              <Accordion.Header className={""}>{n.question}</Accordion.Header>
              <Accordion.Body
                className={"tw-border-b-[1px] tw-border-black/10"}
              >
                {n.answer?.split("\n").map((c) => (
                  <>
                    {c}
                    <br />
                  </>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          ))}
      </Accordion>
    </>
  );
};

export default FAQSection;
