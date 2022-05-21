import React, { useState } from "react";
import TabMemu from "../common/tabmenu";
import MyPageCare from "./mypageCare/mypageCare";
import MyPageInfo from "./mypageInfo";

interface MyPageContentProps {}

const MyPageContent: React.FC<MyPageContentProps> = ({ children }) => {
  const [tab, setTab] = useState("기본정보");

  const handleTabChange = (selected: string) => {
    setTab(selected);
  };
  return (
    <div className="tw-mt-10 tw-pl-10">
      <h3 className="tw-mb-5">마이페이지</h3>
      <TabMemu
        menuList={["기본정보", "계정관리"]}
        selected={tab}
        handleClick={handleTabChange}
        className="!tw-justify-start"
      />
      <div className="tw-pt-10">
        {tab === "기본정보" && <MyPageInfo />}
        {tab === "계정관리" && <MyPageCare />}
      </div>
    </div>
  );
};

export default MyPageContent;
