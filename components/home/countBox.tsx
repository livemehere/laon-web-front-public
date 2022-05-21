import React from "react";

interface CountBoxProps {
  text: string;
  value: number;
}

const numberWithCommas = (x: number | string) => {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const CountBox: React.FC<CountBoxProps> = ({ children, text, value }) => {
  return (
    <div className="tw-text-center tw-text-blue-900">
      <h6 className="tw-mb-0">{text}</h6>
      <h2 className="tw-font-bold tw-mt-0">{numberWithCommas(value)}</h2>
    </div>
  );
};

export default CountBox;
