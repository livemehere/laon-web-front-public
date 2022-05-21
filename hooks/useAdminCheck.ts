import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/userAtom";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useAdminCheck() {
  const user = useRecoilValue(userState);
  const router = useRouter();

  // 관리자가 아니라면 홈으로 반환
  useEffect(() => {
    if (user?.is_admin !== 1 || user === null) {
      router.push("/");
    }
  }, []);
}
