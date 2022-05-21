import Head from "next/head";
import React, { useEffect } from "react";
import MyPageWrap from "../../components/mypage/myPage";
import MyPageContent from "../../components/mypage/mypageContent";
import { useRecoilState } from "recoil";
import { filterIsOpenState } from "../../recoil/atoms/filterIsOpenState";
import AxiosManager from "../../util/axiosManager";
import { userState } from "../../recoil/atoms/userAtom";
import { addressState } from "../../recoil/atoms/addressAtom";

interface MyPageProps {}

const MyPage: React.FC<MyPageProps> = ({ children }) => {
  const [user, setUser] = useRecoilState(userState);
  const [address, setAddress] = useRecoilState(addressState);

  const getAddress = async () => {
    const addressResult = await AxiosManager.get("/users/address", {
      user_seq: user?.user_seq,
    });
    if (!user) return;
    setAddress(addressResult.data.addressBook); // 주소록 저장
  };

  useEffect(() => {
    getAddress();
  }, [user]);

  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 마이페이지</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MyPageWrap content={<MyPageContent />} />
    </>
  );
};

export default MyPage;
