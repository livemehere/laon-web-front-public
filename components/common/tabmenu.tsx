import React, { useState } from "react";

interface TabMemuProps {
  menuList: string[];
  selected: string;
  handleClick: (selected: string) => void;
  className?: string;
}

const TabMemu: React.FC<TabMemuProps> = ({ children, menuList, selected, handleClick, className }) => {
  return (
    <div className={`tw-flex tw-justify-center ${className}`}>
      {menuList.map((menu, idx) => (
        <div
          key={idx}
          onClick={() => handleClick(menu)}
          className={
            "tw-border-b-2 tw-border-gray tw-px-5 tw-py-2 tw-cursor-pointer " +
            (selected === menu && "tw-border-primary")
          }
        >
          {menu}
        </div>
      ))}
    </div>
  );
};

export default TabMemu;
