import React from "react";
import { Col, Row } from "react-bootstrap";
import Input from "./input";

interface Props {
  url: string;
  descriptions?: string[];
  name?: string;
  handleChange?: (name: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  input: any;
}

const URLForm: React.FC<Props> = ({
  url,
  descriptions,
  name,
  handleChange,
  input,
}: Props) => {
  const target = name;
  return (
    <div>
      <div className={"tw-flex tw-items-center tw-gap-1"}>
        {url}
        <Input
          placeholder="url"
          className="tw-flex-1"
          name={name}
          handleChange={handleChange}
          value={input[target!]}
        />
      </div>
      <div>
        {descriptions &&
          descriptions.map((d, idx) => (
            <p key={idx} className={"tw-text-gray-800 tw-mb-0 tw-text-[.85em]"}>
              - {d}
            </p>
          ))}
      </div>
    </div>
  );
};

export default URLForm;
