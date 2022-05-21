import Link from "next/link";
import React from "react";

interface NavButtonProps {
  callback: any;
  selectedMenu: string;
  menuName: string;
}

const NavButton: React.FC<NavButtonProps> = ({
  children,
  callback,
  selectedMenu,
  menuName,
}) => {
  return (
    <div
      className={
        "tw-cursor-pointer hover:tw-font-bold tw-text-xl " +
        `${selectedMenu === menuName && "tw-font-bold tw-text-primary"}`
      }
      onClick={callback}
    >
      {children}
    </div>
  );
};

export default NavButton;
