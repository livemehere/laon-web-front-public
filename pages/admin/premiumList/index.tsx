import React, { useState } from "react";
import Head from "next/head";
import Header from "../../../components/common/header";
import Layout from "../../../components/common/layout";
import dayjs from "dayjs";
import Link from "next/link";
import Footer from "../../../components/common/footer";
import { useRouter } from "next/router";
import { CampaignType } from "../../../recoil/atoms/campaign";
import { GetServerSideProps } from "next";
import AxiosManager from "../../../util/axiosManager";

interface PremiumType {
  address: string;
  address_seq: number;
  agreement_content: number;
  birth: string;
  blog: string;
  gender: string;
  grade: number;
  influencer: string;
  instagram: string;
  name: string;
  phonenumber: string;
  premium_seq: number;
  user_seq: number;
  youtube: string;
  is_pending: 0 | 1 | -1;
}
interface Props {
  list: PremiumType[];
}

const PremiumList: React.FC<Props> = ({ list }) => {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [data, setData] = useState<PremiumType[]>(list);
  const handleLoadMoreList = () => {
    const maxPage = Math.ceil(data.length / 16);
    setPage((prev) => {
      return prev + 1 >= maxPage ? maxPage : prev + 1;
    });
  };
  console.log(list);

  const fetchPremiumList = async () => {
    const result = await AxiosManager.get("/users/premium/application");
    const list = result.data.premiumRequestList;
    setData(list);
  };

  const handleApprove = async (user_seq: number, premium_seq: number) => {
    const r = await AxiosManager.patch("/users/premium/application/approve", {
      user_seq,
      premium_seq,
      admin: 99,
    });
    console.log(r);
    if (r.status === 200) {
      alert(r.data.message);
      fetchPremiumList();
    } else {
      alert(r.response.data.message);
    }
  };

  const handleShowOnlyNoAnswer = () => {
    setData([...data].filter((d) => d.is_pending === 1));
  };

  const handleReject = async (user_seq: number, premium_seq: number) => {
    const r = await AxiosManager.patch("/users/premium/application/reject", {
      user_seq,
      premium_seq,
      admin: 99,
    });
    console.log(r);
    if (r.status === 200) {
      alert(r.data.message);
      fetchPremiumList();
    } else {
      alert(r.response.data.message);
    }
  };

  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 프리미엄 신청 관리</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Header />
        <Layout className="tw-mb-10">
          <div className="tw-relative tw-overflow-x-auto tw-shadow-md sm:tw-rounded-lg tw-mt-10">
            <h2>
              프리미엄 신청 리스트{" "}
              <span className={"tw-text-sm tw-text-black/50"}>
                * 유저이름을 클릭하여 상세페이지를 확인할 수 있습니다
              </span>
              <button
                className={"laon-btn !tw-w-[200px] tw-text-sm !tw-ml-5"}
                onClick={handleShowOnlyNoAnswer}
              >
                처리되지 않은 요청만 보기
              </button>
            </h2>
            <table className="tw-w-full tw-text-sm tw-text-left tw-text-gray-500 dark:tw-text-gray-400">
              <thead className="tw-text-xs tw-text-gray-700 tw-uppercase tw-bg-gray-50 dark:tw-bg-gray-700 dark:tw-text-gray-400">
                <tr>
                  <th scope="col" className="tw-px-6 tw-py-3 tw-text-center">
                    시퀀스
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3 tw-text-center">
                    유저 시퀀스
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3 tw-text-center">
                    이름
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3 tw-text-center">
                    성별
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3 tw-text-center">
                    출생년도
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3 tw-text-center">
                    전화번호
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3 tw-text-center">
                    상태
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3 tw-text-center">
                    <span className="">승인 / 반려</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.slice(0, page * 16).map((c) => (
                    <tr key={c.premium_seq} className="">
                      <td className="tw-px-6 tw-py-4 tw-text-center">
                        {c.premium_seq}
                      </td>
                      <td className="tw-px-6 tw-py-4 tw-text-center">
                        {c.user_seq}
                      </td>
                      <td className="tw-px-6 tw-py-4 tw-text-center">
                        <span
                          className={"tw-text-amber-700 hover:tw-underline"}
                        >
                          <Link href={`/admin/user/${c.user_seq}`}>
                            {c.name}
                          </Link>
                        </span>
                      </td>
                      <td className="tw-px-6 tw-py-4 tw-text-center">
                        {c.gender}
                      </td>
                      <td className="tw-px-6 tw-py-4 tw-text-center">
                        {c.birth}
                      </td>
                      <td className="tw-px-6 tw-py-4 tw-text-center">
                        {c.phonenumber.replace(
                          /^(\d{2,3})(\d{3,4})(\d{4})$/,
                          `$1-$2-$3`
                        )}
                      </td>
                      <td className="tw-px-6 tw-py-4 tw-text-center">
                        {c.is_pending === -1 && (
                          <span className="tw-text-red-500">거절</span>
                        )}
                        {c.is_pending === 1 && (
                          <span className="tw-text-black">신청</span>
                        )}
                        {c.is_pending === 0 && (
                          <span className="tw-text-blue-500">승인</span>
                        )}
                      </td>
                      <td className="tw-px-6 tw-py-4 tw-text-center tw-flex tw-gap-1">
                        <button
                          className={"laon-btn hover:tw-bg-primary/50"}
                          onClick={() =>
                            handleApprove(c.user_seq, c.premium_seq)
                          }
                        >
                          승인하기
                        </button>
                        <button
                          className={
                            "laon-btn !tw-bg-red-400 hover:!tw-bg-red-400/50"
                          }
                          onClick={() =>
                            handleReject(c.user_seq, c.premium_seq)
                          }
                        >
                          반려하기
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div
              className={"!tw-mt-6 tw-flex tw-justify-center"}
              onClick={handleLoadMoreList}
            >
              <span className="tw-cursor-pointer tw-py-2 tw-ml-0 tw-leading-tight tw-text-gray-500 tw-bg-white tw-rounded-lg tw-border tw-border-gray-300 tw-hover:bg-gray-100 hover:tw-text-gray-700 tw-w-[100%] tw-text-center">
                신청목록 더 불러오기
              </span>
            </div>
          </div>
        </Layout>
        <Footer />
      </>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const result = await AxiosManager.get("/users/premium/application");
  const list = result.data.premiumRequestList;
  return {
    props: { list },
  };
};

export default PremiumList;
