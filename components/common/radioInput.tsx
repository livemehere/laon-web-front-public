import React, { ChangeEvent, useState } from "react";

interface RadioInputProps {
  list: string[];
  name: string;
  callback?: (value: string) => void;
  input: any;
}

const RadioInput: React.FC<RadioInputProps> = ({
  children,
  list,
  name,
  input,
  callback,
}) => {
  const [checked, setChecked] = useState(
    input && input.gender === "M" ? "남자" : "여자"
  );

  const handleChange = (value: any) => {
    setChecked(value);
    callback && callback(value);
  };

  return (
    <div className="tw-flex tw-gap-8">
      {list.map((item, idx) => (
        <div key={idx}>
          <label>
            <input
              type="radio"
              name={name}
              value={item}
              className="tw-mr-1"
              checked={checked === item}
              onChange={(e) => handleChange(item)}
            />
            <span>{item}</span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioInput;
