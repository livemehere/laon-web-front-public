import React from "react";

interface SideMenuProps {}

const SideMenu: React.FC<SideMenuProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default SideMenu;
