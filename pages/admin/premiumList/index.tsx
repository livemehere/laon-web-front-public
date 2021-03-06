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
        <title>??????????????? ????????? | ???????????? ?????? ??????</title>
        <meta name="description" content="??????????????? ??????????????????" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Header />
        <Layout className="tw-mb-10">
          <div className="tw-relative tw-overflow-x-auto tw-shadow-md sm:tw-rounded-lg tw-mt-10">
            <h2>
              ???????????? ?????? ?????????{" "}
              <span className={"tw-text-sm tw-text-black/50"}>
                * ??????????????? ???????????? ?????????????????? ????????? ??? ????????????
              </span>
              <button
                className={"laon-btn !tw-w-[200px] tw-text-sm !tw-ml-5"}
                onClick={handleShowOnlyNoAnswer}
              >
                ???????????? ?????? ????????? ??????
              </button>
            </h2>
            <table className="tw-w-full tw-text-sm tw-text-left tw-text-gray-500 dark:tw-text-gray-400">
              <thead className="tw-text-xs tw-text-gray-700 tw-uppercase tw-bg-gray-50 dark:tw-bg-gray-700 dark:tw-text-gray-400">
                <tr>
                  <th scope="col" className="tw-px-6 tw-py-3 tw-text-center">
                    ?????????
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3 tw-text-center">
                    ?????? ?????????
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3 tw-text-center">
                    ??????
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3 tw-text-center">
                    ??????
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3 tw-text-center">
                    ????????????
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3 tw-text-center">
                    ????????????
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3 tw-text-center">
                    ??????
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3 tw-text-center">
                    <span className="">?????? / ??????</span>
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
                          <span className="tw-text-red-500">??????</span>
                        )}
                        {c.is_pending === 1 && (
                          <span className="tw-text-black">??????</span>
                        )}
                        {c.is_pending === 0 && (
                          <span className="tw-text-blue-500">??????</span>
                        )}
                      </td>
                      <td className="tw-px-6 tw-py-4 tw-text-center tw-flex tw-gap-1">
                        <button
                          className={"laon-btn hover:tw-bg-primary/50"}
                          onClick={() =>
                            handleApprove(c.user_seq, c.premium_seq)
                          }
                        >
                          ????????????
                        </button>
                        <button
                          className={
                            "laon-btn !tw-bg-red-400 hover:!tw-bg-red-400/50"
                          }
                          onClick={() =>
                            handleReject(c.user_seq, c.premium_seq)
                          }
                        >
                          ????????????
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
                ???????????? ??? ????????????
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
