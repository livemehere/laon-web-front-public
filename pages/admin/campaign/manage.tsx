import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../../components/common/header";
import Layout from "../../../components/common/layout";
import AdminCard from "../../../components/admin/card";
import Footer from "../../../components/common/footer";
import { Button, FloatingLabel, Form, Table } from "react-bootstrap";
import useInput from "../../../hooks/useInput";
import InputForm from "../../../components/admin/inputForm";
import { useRecoilValue } from "recoil";
import { userState } from "../../../recoil/atoms/userAtom";
import AxiosManager from "../../../util/axiosManager";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { CampaignType } from "../../../recoil/atoms/campaign";
import dayjs from "dayjs";
import Link from "next/link";
import { BiDownload } from "react-icons/bi";

interface Props {}

export interface NewCampaignType {
  advertiser: number;
  is_premium: number;
  title: string;
  category: string;
  product: string;
  channel: string;
  area: string;
  keyword: string;
  headcount: string;
  siteURL: string;
  misson: string;
  reward: string;
  original_price: number;
  discount_price: number;
  accrual_point: number;
  campaign_guide: string;
  recruit_start_date: string;
  recruit_end_date: string;
  reviewer_announcement_date: string;
  review_start_date: string;
  review_end_date: string;
  campaign_end_date: string;
  agreement_portrait: number;
  agreement_provide_info: number;
  user_seq: number;
}

interface Props {
  campaigns: CampaignType[];
}

const CampaignNew: React.FC<Props> = ({ campaigns }) => {
  const user = useRecoilValue(userState);
  const router = useRouter();
  const [data, setData] = useState<CampaignType[]>(
    campaigns.sort((a, b) =>
      dayjs(a.campaign_end_date).diff(b.campaign_end_date, "d")
    )
  );
  const [page, setPage] = useState(1);

  const handleRemoveCampaign = async (campaign_seq: number) => {
    const result = await AxiosManager.delete(
      `/campaigns?campaign_seq=${campaign_seq}`
    );
    if (result.status === 200) {
      const result = await AxiosManager.get("/campaigns/all");
      setData(result.data.campaigns);
      alert("?????????????????????");
    } else {
      alert("?????? ??? ????????? ?????????????????????");
    }
  };
  const handleLoadMoreCampaign = () => {
    const maxPage = Math.ceil(data.length / 16);
    setPage((prev) => {
      return prev + 1 >= maxPage ? maxPage : prev + 1;
    });
  };

  return (
    <>
      <Head>
        <title>??????????????? ????????? | ????????? ??????</title>
        <meta name="description" content="??????????????? ??????????????????" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Header />
        <Layout className="tw-mb-10">
          <div className="tw-relative tw-overflow-x-auto tw-shadow-md sm:tw-rounded-lg tw-mt-10">
            <p className={"tw-text-black/40"}>
              * ??????????????? ?????? ???????????? ???????????????.
            </p>
            <table className="tw-w-full tw-text-sm tw-text-left tw-text-gray-500 dark:tw-text-gray-400">
              <thead className="tw-text-xs tw-text-gray-700 tw-uppercase tw-bg-gray-50 dark:tw-bg-gray-700 dark:tw-text-gray-400">
                <tr>
                  <th scope="col" className="tw-px-6 tw-py-3">
                    ?????????
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3">
                    ????????? ??????
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3">
                    ???????????? / ????????????
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3">
                    ??????
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3">
                    ?????????
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3">
                    ????????? ??? / ???????????? ???
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3">
                    <span className="">?????? / ?????? / ???????????????</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.slice(0, page * 16).map((c) => (
                    <tr key={c.campaign_seq} className="">
                      <td className="tw-px-6 tw-py-4">{c.campaign_seq}</td>
                      <th
                        scope="row"
                        className="tw-px-6 py-4 tw-font-medium tw-text-gray-900 tw-whitespace-nowrap"
                      >
                        {c.title}
                      </th>
                      <td className="tw-px-6 tw-py-4">
                        <span className={"tw-text-black"}>
                          {dayjs(c.first_register_date).format("YYYY-MM-DD")}
                        </span>{" "}
                        /{" "}
                        <span className={"tw-text-amber-700"}>
                          {dayjs(c.campaign_end_date).format("YYYY-MM-DD")}
                        </span>
                      </td>
                      <td className="tw-px-6 tw-py-4">{c.product}</td>
                      <td className="tw-px-6 tw-py-4">{c.view_count}</td>
                      <td className="tw-px-6 tw-py-4">
                        <span className={"tw-text-black"}>
                          {c.applicant_count}
                        </span>
                        <span className={"tw-mx-1"}>/</span>
                        <span className={"tw-text-black"}>{c.headcount}</span>
                      </td>
                      <td className="tw-px-6 tw-py-4 text-right">
                        <span className="!tw-font-medium !tw-text-blue-600  hover:!tw-underline tw-mr-5">
                          <Link href={`/admin/campaign/edit/${c.campaign_seq}`}>
                            Edit
                          </Link>
                        </span>
                        <button
                          className="tw-font-medium !tw-text-red-600  hover:tw-underline tw-mr-5"
                          onClick={() => handleRemoveCampaign(c.campaign_seq)}
                        >
                          ??????
                        </button>
                        <span className="!tw-font-medium !tw-text-blue-600  hover:!tw-underline tw-mr-3">
                          <Link href={`/admin/campaign/info/${c.campaign_seq}`}>
                            ???????????????
                          </Link>
                        </span>
                        <button
                          className="tw-font-medium !tw-text-black  hover:tw-underline !tw-inline-block hover:tw-scale-125 tw-transition-all"
                          // onClick={() => handleDownloadXlsx(c.campaign_seq)}
                        >
                          <a
                            href={`${process.env.serverURL}/statistics/download?campaign_seq=${c.campaign_seq}`}
                          >
                            <BiDownload />
                          </a>
                        </button>
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
                ????????? ???????????????
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
  const result = await AxiosManager.get("/campaigns/all");
  const campaigns = result.data.campaigns;
  return {
    props: { campaigns },
  };
};

export default CampaignNew;
