import React from "react";

interface DividerProps {
  mount?:string;
}

const Divider: React.FC<DividerProps> = ({ children ,mount}) => {
  return <div className={`tw-h-[1px] tw-w-[100%] tw-bg-gray-${mount ? mount : '500'} tw-my-2 `} />;
};

export default Divider;
