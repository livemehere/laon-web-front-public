import React, { ChangeEvent, FormEvent } from "react";
import { Form } from "react-bootstrap";
import { NewCampaignType } from "../../pages/admin/campaign/new";
import { HandleChangeType } from "../../hooks/useInput";

interface Props {
  title: string;
  desc?: string;
  name: string;
  input: any;
  handleChange: HandleChangeType;
}

const InputForm: React.FC<Props> = ({
  title,
  desc,
  input,
  name,
  handleChange,
}) => {
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(name, e.target.value);
  };
  return (
    <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>{title}</Form.Label>
      <Form.Control
        type="text"
        placeholder={title}
        value={input[name]}
        onChange={onChange}
      />
      <Form.Text className="text-muted">{desc}</Form.Text>
    </Form.Group>
  );
};

export default InputForm;
