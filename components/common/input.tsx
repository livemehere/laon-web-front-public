import React, { ChangeEvent } from "react";

interface InputProps {
  placeholder?: string;
  secondPlaceholder?: string | JSX.Element;
  type?: string;
  className?: string;
  onClick?: () => void;
  name?: string;
  handleChange?: (name: string, value: any) => void;
  value: any;
}

const Input: React.FC<InputProps> = ({
  children,
  placeholder,
  secondPlaceholder,
  type,
  className,
  value,
  onClick,
  handleChange,
  name,
}) => {
  return (
    <div className={`tw-my-1 tw-relative ${className}`}>
      <input
        type={type}
        value={value}
        onClick={onClick}
        placeholder={placeholder}
        className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300 tw-text-md"
        onChange={(e) => {
          handleChange && handleChange(name!, e.target.value);
        }}
      />
      <span
        className={`tw-absolute tw-right-[5px] tw-top-[50%] tw-translate-y-[-50%] tw-text-xs tw-text-gray-400`}
      >
        {secondPlaceholder}
      </span>
    </div>
  );
};

export default Input;

Input.defaultProps = {
  type: "text",
};
