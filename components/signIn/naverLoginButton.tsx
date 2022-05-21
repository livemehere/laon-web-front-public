import React, { useEffect, useRef } from "react";

interface Props {}

const NaverLoginButton: React.FC<Props> = ({}) => {
  const handleClick = () => {
    if (
      document &&
      document?.querySelector("#naver_id_login")?.firstChild &&
      window !== undefined
    ) {
      const loginBtn: any =
        document.querySelector("#naver_id_login")?.firstChild;
      loginBtn.click();
    }
  };

  return (
    <div onClick={handleClick} className={"tw-cursor-pointer"}>
      <div id="naver_id_login" className={"tw-h-[50px] tw-hidden"} />
      <img
        src="/images/naver/btnW_완성형.png"
        alt="naver-btn"
        className={"tw-h-[44px] tw-w[100%]"}
      />
    </div>
  );
};

export default NaverLoginButton;
