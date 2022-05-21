import { useRecoilState } from "recoil";
import { userState } from "../recoil/atoms/userAtom";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";

export default function useLogout() {
  const [user, setUser] = useRecoilState(userState);
  const router = useRouter();

  const kakaoLogout = async () => {
    if (!user) return;
    // const r = await axios.get(
    //   `https://kauth.kakao.com/oauth/logout?client_id=${process.env.kakaoClientId}&logout_redirect_uri=http://localhost:3000`
    // );
    // console.log("client", r);
  };

  const handleLogout = () => {
    // kakaoLogout();
    setUser(null);
    window.localStorage.removeItem("isAutoLogin");
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refreshToken");
    window.localStorage.removeItem("is_sns");
    window.location.href = "/";
  };

  return handleLogout;
}
