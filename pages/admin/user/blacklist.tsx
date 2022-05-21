import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AxiosManager from "../../../util/axiosManager";
import Header from "../../../components/common/header";
import Footer from "../../../components/common/footer";
import Layout from "../../../components/common/layout";
interface Props {}

interface BlackUserType {
  accumulated_point: number;
  agreement_email: number;
  agreement_info: number;
  agreement_mms: number;
  birth: string;
  blacklist_seq: number;
  blog: string;
  bottoms_size: null;
  companion_animal: null;
  content: string;
  email: string;
  first_register_date: string;
  first_register_id: number;
  gender: string;
  grade: number;
  having_child: null;
  height: null;
  id: string;
  influencer: string;
  instagram: null;
  is_active: number;
  is_admin: number;
  is_advertiser: number;
  is_premium: number;
  job: null;
  last_register_date: string;
  last_register_id: number;
  marital_status: null;
  name: string;
  nickname: string;
  phonenumber: string;
  point: number;
  profile_ext: string;
  profile_key: string;
  profile_name: string;
  profile_path: string;
  shoe_size: null;
  skin_type: null;
  tops_size: null;
  user_seq: number;
  youtube: null;
}

const BlackList: React.FC<Props> = ({}) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [users, setUsers] = useState<BlackUserType[]>([]);
  const [searchInput, setSearchInput] = useState("");

  const getAllUsers = async () => {
    const r = await AxiosManager.get("/users/blacklist");
    console.log(r);
    if (r.status === 200) {
      console.log(r.data.blacklist);
      setUsers(r.data.blacklist);
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

  //FIXME: API수정 되면 확인하기
  const handleAddBlackList = async (seq: number) => {
    const r = await AxiosManager.delete("/users/blacklist", {
      blacklist_seq: seq,
    });
    console.log(r);
    if (r.status === 200) {
      alert("블랙리스트에서 해제되었습니다");
      getAllUsers();
    } else {
      alert("해제 실패");
    }
  };
  return (
    <>
      <Header />
      <Layout className="tw-mb-10">
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
                users.slice(0, page * 16).map((c) => (
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
                        onClick={() => handleAddBlackList(c.blacklist_seq)}
                      >
                        - 블랙
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

export default BlackList;
