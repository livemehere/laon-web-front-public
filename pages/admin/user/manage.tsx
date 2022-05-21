import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import AxiosManager from "../../../util/axiosManager";
import Header from "../../../components/common/header";
import Footer from "../../../components/common/footer";
import Layout from "../../../components/common/layout";
import { UserType } from "../../../recoil/atoms/userAtom";
interface Props {}

const UserManage: React.FC<Props> = ({}) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchInput, setSearchInput] = useState("");

  const getAllUsers = async () => {
    const r = await AxiosManager.get("/users/all");
    if (r.status === 200) {
      console.log(r.data.users);
      setUsers(r.data.users);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleLoadMoreCampaign = () => {
    const maxPage = Math.ceil(users.length / 16);
    setPage((prev) => {
      return prev + 1 >= maxPage ? maxPage : prev + 1;
    });
  };

  const filterCallback = (u: UserType) => {
    let isMatch = false;
    let word = searchInput;
    if (word === "일반") {
      if (u.is_premium === 0) return true;
    } else if (word === "프리미엄") {
      if (u.is_premium === 1) return true;
    }

    if (word === "남") word = "M";
    if (word === "여") word = "F";

    let regExp = new RegExp(word);
    Object.keys(u).forEach((k) => {
      if (k === "point") return;
      if (regExp.test(u[k])) isMatch = true;
    });

    return searchInput.length === 0 ? true : isMatch;
  };

  //FIXME: API수정 되면 확인하기
  const handleAddBlackList = async (seq: number) => {
    const r = await AxiosManager.post("/users/blacklist", {
      user_seq: seq,
      content: "블랙리스트",
      admin: 99,
    });
    console.log(r);
    if (r.status === 200) {
      alert("블랙리스트로 등록되었습니다");
    } else {
      alert("등록실패");
    }
  };
  return (
    <>
      <Header />
      <Layout className="tw-mb-10">
        <input
          type="text"
          id="first_name"
          className="tw-mt-10 tw-bg-gray-50 tw-border tw-border-gray-100 tw-text-gray-900 tw-text-sm tw-rounded-lg focus:tw-ring-blue-500 focus:tw-border-blue-500 tw-block tw-w-full tw-p-2.5  dark:tw-border-gray-300 dark:tw-placeholder-gray-400  dark:focus:tw-ring-blue-500 dark:focus:tw-border-blue-500"
          placeholder="전체 속성으로 사용자 필터링"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <div className="tw-relative tw-overflow-x-auto tw-shadow-md sm:tw-rounded-lg tw-mt-4">
          <table className="tw-w-full tw-text-sm tw-text-left tw-text-gray-500 dark:tw-text-gray-400">
            <thead className="tw-text-xs tw-text-gray-700 tw-uppercase tw-bg-gray-50 dark:tw-bg-gray-700 dark:tw-text-gray-400">
              <tr>
                <th scope="col" className="tw-px-6 tw-py-3">
                  시퀀스
                </th>
                <th scope="col" className="tw-px-6 tw-py-3">
                  프리미엄
                </th>
                <th scope="col" className="tw-px-6 tw-py-3">
                  이름(닉네임)
                </th>
                <th scope="col" className="tw-px-6 tw-py-3">
                  생년월일
                </th>
                <th scope="col" className="tw-px-6 tw-py-3">
                  성별
                </th>
                <th scope="col" className="tw-px-6 tw-py-3">
                  이메일
                </th>
                <th scope="col" className="tw-px-6 tw-py-3">
                  전화번호
                </th>
                <th scope="col" className="tw-px-6 tw-py-3">
                  포인트
                </th>
                {/*TODO: 기능추가 */}
                <th scope="col" className="tw-px-6 tw-py-3">
                  <span className="">관리</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users
                  .filter(filterCallback)
                  .slice(0, page * 16)
                  .map((c) => (
                    <tr key={c.user_seq} className="">
                      <td className="tw-px-6 tw-py-4">{c.user_seq}</td>
                      <td className="tw-px-6 tw-py-4">
                        {c.is_premium ? (
                          <span className={"tw-text-blue-500"}>[프리미엄]</span>
                        ) : (
                          <span className={"tw-text-black/50"}>[일반]</span>
                        )}
                      </td>
                      <td
                        scope="row"
                        className="tw-px-6 py-4 tw-font-medium tw-text-gray-900 tw-whitespace-nowrap"
                      >
                        {c.name}
                        <span className={"tw-text-xs tw-text-black/50"}>
                          ({c.nickname})
                        </span>
                      </td>
                      <td className="tw-px-6 tw-py-4">{c.birth}</td>
                      <td className="tw-px-6 tw-py-4">
                        {c.gender === "M" ? "남" : "여"}
                      </td>
                      <td className="tw-px-6 tw-py-4">{c.email}</td>
                      <td className="tw-px-6 tw-py-4">
                        {c.phonenumber.replace(
                          /^(\d{2,3})(\d{3,4})(\d{4})$/,
                          `$1-$2-$3`
                        )}
                      </td>
                      <td className="tw-px-6 tw-py-4">{c.point} P</td>
                      {/* TODO: 기능추가 */}
                      <td className="tw-px-6 tw-py-4 text-right">
                        <span className="!tw-font-medium !tw-text-blue-600  hover:!tw-underline tw-mr-5">
                          <Link href={`/admin/user/${c.user_seq}`}>관리</Link>
                        </span>
                        <span
                          className="!tw-font-medium !tw-text-red-600  hover:!tw-underline tw-mr-5 tw-cursor-pointer"
                          onClick={() => handleAddBlackList(c.user_seq)}
                        >
                          + 블랙
                        </span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          <div
            className={"!tw-mt-6 tw-flex tw-justify-center"}
            onClick={handleLoadMoreCampaign}
          >
            <span className="tw-cursor-pointer tw-py-2 tw-ml-0 tw-leading-tight tw-text-gray-500 tw-bg-white tw-rounded-lg tw-border tw-border-gray-300 tw-hover:bg-gray-100 hover:tw-text-gray-700 tw-w-[100%] tw-text-center">
              유저정보 더 불러오기
            </span>
          </div>
        </div>
      </Layout>
      <Footer />
    </>
  );
};

export default UserManage;
