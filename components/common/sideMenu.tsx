import Image from "next/image";
import Link from "next/link";
import React, { ChangeEvent, useState } from "react";
import { Form, Row } from "react-bootstrap";
import Button from "./Button";
import { useRecoilState } from "recoil";
import { userState } from "../../recoil/atoms/userAtom";
import { AiFillCamera } from "react-icons/ai";
import AxiosManager from "../../util/axiosManager";

interface SideMenuProps {}

const SideMenu: React.FC<SideMenuProps> = ({ children }) => {
  const [user, setUser] = useRecoilState(userState);

  const [menu, setMenu] = useState([
    { title: "메세지함", url: "/mypage/message" },
    { title: "마이페이지", url: "/mypage" },
    { title: "내가 신청한 캠페인", url: "/mypage/my-campain" },
    { title: "종료된 캠페인", url: "/mypage/end-campain" },
    { title: "관심 캠페인", url: "/mypage/interest-campain" },
    // { title: "나의 등급", url: "/mypage/rank" }, //TODO: 2차
    { title: "나의 포인트", url: "/mypage/point" },
    { title: "문의하기", url: "/mypage/query" },
    // { title: "프리미엄 신청하기", url: "/mypage/premium-apply" },
  ]);
  const numberWithCommas = (x: number | string) => {
    return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const handleChangeProfileImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user) return;

    const formData = new FormData();
    formData.append("profile_img", e.target.files[0]);
    formData.append("user_seq", user?.user_seq.toString());
    formData.append("id", user?.email.toString());

    const r = await AxiosManager.post("/users/profile", formData);
    // 프로필 사진 업로드가 성공적으로 되었다면, 유저정보 다시받아와서 최신화
    if (r.status === 200) {
      const u = await AxiosManager.get(`/users?user_seq=${user.user_seq}`);
      setUser(u.data.user);
    }
  };
  return (
    <div className="tw-mt-10">
      {/* 프로필 부분 */}
      <div>
        {/* 이미지 + 이름 */}
        <div className="tw-text-center">
          <div className="tw-w-[150px] tw-h-[150px] tw-m-auto tw-relative">
            {/* <div className="tw-relative tw-w[200px] tw-h-[200px] tw-bg-[url(https://picsum.photos/200/200)] tw-bg-no-repeat tw-bg-cover tw-rounded-full"></div> */}
            <img
              src={user?.profile_path || "/images/userIcon.png"}
              alt="profile"
              className="tw-rounded-full  tw-w-[100%] tw-h-[100%] tw-object-cover"
            />
            <div
              className={
                "tw-absolute tw-right-[-5px] tw-bottom-[-5px] tw-bg-gray-900 tw-rounded-full tw-p-1"
              }
            >
              <label className={"tw-inline tw-cursor-pointer"}>
                <AiFillCamera size={35} color={"#E5E5E5"} />
                <input
                  type="file"
                  style={{ display: "none" }}
                  accept="image/png, image/jpeg"
                  onChange={(e) => handleChangeProfileImage(e)}
                />
              </label>
            </div>
          </div>
          <p className="tw-text-center tw-mt-5">{user?.name}</p>
        </div>
        {/* 멤버쉽,마이포인트,프리미엄 */}
        <div>
          <div className="tw-flex tw-my-3">
            <div className="tw-flex-1 tw-text-center">맴버쉽</div>
            <div className="tw-flex-1 tw-text-center">NEW</div>
          </div>
          <div className="tw-flex tw-my-3">
            <div className="tw-flex-1 tw-text-center">마이 포인트</div>
            <div className="tw-flex-1 tw-text-center">
              {numberWithCommas(Number(user?.point))}P
            </div>
          </div>
          <div className="tw-flex tw-my-3">
            <div className="tw-flex-1 tw-text-center">프리미엄</div>
            <div className="tw-flex-1 tw-text-center">
              {/*TODO: 프리미엄 링크처리 && 아이콘 받기*/}
              {user?.is_premium === 0 ? (
                <span
                  className={"tw-cursor-pointer"}
                  onClick={() =>
                    window.open(
                      "/mypage/premium-apply",
                      "popup",
                      "width=600,height=800"
                    )
                  }
                >
                  지금 신청해보세요
                </span>
              ) : (
                "프리미엄 회원입니다"
              )}
            </div>
          </div>
        </div>
        {/* 출석버튼 */}
        <div className="tw-my-3">
          <Link href={"/mypage/attendence"}>
            <button
              className={"tw-bg-primary tw-py-2 tw-w-[100%] tw-text-white"}
            >
              출석하기
            </button>
          </Link>
        </div>
      </div>
      {/* 메뉴 부분 */}
      <div>
        <ul className="tw-divide-y-2 tw-pl-0">
          {menu.map((item) => (
            <li key={item.title} className="tw-py-3 ">
              <Link href={item.url}>{item.title}</Link>
            </li>
          ))}
          <li className="tw-py-3 ">
            <span
              className={"tw-cursor-pointer "}
              onClick={() =>
                window.open(
                  "/mypage/premium-apply",
                  "popup",
                  "width=600,height=800"
                )
              }
            >
              프리미엄 신청하기
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideMenu;
