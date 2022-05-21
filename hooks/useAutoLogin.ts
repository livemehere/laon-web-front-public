import { useRecoilState } from "recoil";
import { userState } from "../recoil/atoms/userAtom";
import { useEffect } from "react";
import AxiosManager from "../util/axiosManager";
import { addressState } from "../recoil/atoms/addressAtom";
import { useRouter } from "next/router";

export function useAutoLogin() {
  const [user, setUser] = useRecoilState(userState);
  const router = useRouter();

  // 로그아웃 하지 않았다면 LocalStorage에 user_seq가 남아있을거임, 그걸로 새로고침했을때, 재로그인 시켜야됨
  useEffect(() => {
    loginWithToken();
  }, []);

  const loginWithToken = async () => {
    AxiosManager.setToken(
      window.localStorage.getItem("accessToken") || "",
      window.localStorage.getItem("refreshToken") || ""
    );
    AxiosManager.createInstance();
    const r = await AxiosManager.post("/auth/login/token");
    console.log("자동 토큰 로그인 결과", r);
    if (r.status === 200) {
      setUser(r.data.user);
      window.localStorage.setItem("accessToken", r.data.data.accessToken);
      window.localStorage.setItem("refreshToken", r.data.data.refreshToken);
    }
  };
}
