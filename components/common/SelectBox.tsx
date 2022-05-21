import React from "react";
import { Form } from "react-bootstrap";

interface SelectBoxProps {
  options: string[];
  input: any;
  handleChange: any;
}

const SelectBox: React.FC<SelectBoxProps> = ({
  children,
  options,
  input,
  handleChange,
}) => {
  return (
    <Form.Select
      value={input.filter}
      onChange={(e) => handleChange("filter", e.target.value)}
    >
      {options.map((option, idx) => (
        <option key={idx} value={option}>
          {option}
        </option>
      ))}
    </Form.Select>
  );
};

export default SelectBox;
