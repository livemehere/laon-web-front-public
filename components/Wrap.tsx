import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/userAtom";
import { useRouter } from "next/router";
import AxiosManager from "../util/axiosManager";
import { useAutoLogin } from "../hooks/useAutoLogin";
import { filterIsOpenState } from "../recoil/atoms/filterIsOpenState";

interface Props {
  children: JSX.Element;
}

const Wrap: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const user = useRecoilValue(userState);

  useAutoLogin();

  // admin 관련페이지인데, 유저상태가 어드민이 아니라면 홈으로 전환
  useEffect(() => {
    if (!user) return;
    if (/admin/g.test(router.pathname)) {
      if (user?.is_admin !== 1) {
        router.push("/");
      }
    }
  }, [user]);

  return <>{children}</>;
};

export default Wrap;
