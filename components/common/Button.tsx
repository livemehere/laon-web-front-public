import React, { MouseEventHandler } from "react";

interface ButtonProps {
  text: string;
  bgColor?: string;
  fontColor?: string;
  border?: boolean;
  borderColor?: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}

const Button: React.FC<ButtonProps> = ({
  children,
  text,
  bgColor,
  fontColor,
  border,
  borderColor,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${bgColor} ${fontColor} tw-w-[100%] tw-py-2.5 hover:tw-bg-primary ${
        border && `${borderColor} tw-border-[1px] `
      }`}
    >
      {text}
    </button>
  );
};

export default Button;

Button.defaultProps = {
  bgColor: "tw-bg-laonGray",
  fontColor: "tw-text-white",
  borderColor: "tw-border-black",
};
