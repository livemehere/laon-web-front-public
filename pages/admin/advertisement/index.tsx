import React, { useEffect, useState } from "react";
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
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios, { AxiosError } from "axios";

interface AdvertisementType {
  advertising_seq: number;
  company_name: string;
  contact: string;
  area: string;
  isagency: number;
  agreement_info: number;
  first_register_date: string;
  last_register_date: string;
  is_pending: 0 | 1 | -1;
}

interface Props {}

const Advertisement: React.FC<Props> = ({}) => {
  const queryClient = useQueryClient();
  const [dataList, setDataList] = useState<AdvertisementType[]>([]);
  const [toggleFilter, setToggleFilter] = useState(false);
  const { data, isSuccess } = useQuery<
    { message: string; advertise: AdvertisementType[] },
    AxiosError
  >(["advertisement"], () =>
    AxiosManager.get(`/advertisement`).then((res) => {
      setDataList(res.data.advertise);
      return res.data;
    })
  );

  const { mutate } = useMutation(
    (data: { advertising_seq: number }) =>
      AxiosManager.patch("/advertisement/approve", data),
    {
      onSuccess: (data) => {
        if (data.status !== 200) {
          return alert("이미 처리가 완료된 요청입니다.");
        }
        queryClient.invalidateQueries("advertisement");
      },
      onError: () => {
        console.log("error");
      },
    }
  );

  const handleShowOnlyNoAnswer = () => {
    setDataList([...dataList].filter((d) => d.is_pending === 1));
  };

  const rejectMutate = useMutation(
    (data: { advertising_seq: number }) =>
      AxiosManager.patch("/advertisement/reject", data),
    {
      onSuccess: () => {
        console.log("yes");
        queryClient.invalidateQueries("advertisement");
      },
      onError: () => {
        console.log("error");
      },
    }
  );

  const handleApprove = async (seq: number) => {
    mutate({ advertising_seq: seq });
  };
  const handleReject = async (seq: number) => {
    rejectMutate.mutate({ advertising_seq: seq });
  };

  const [page, setPage] = useState(1);
  const router = useRouter();

  const handleLoadMoreList = () => {
    if (!data) return;
    const maxPage = Math.ceil(data.advertise.length / 16);
    setPage((prev) => {
      return prev + 1 >= maxPage ? maxPage : prev + 1;
    });
  };
  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 광고 신청 관리</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Header />
        <Layout className="tw-mb-10">
          <div className="tw-relative tw-overflow-x-auto tw-shadow-md sm:tw-rounded-lg tw-mt-10">
            <h2>
              <span>광고 신청 리스트</span>
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
                    회사명
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3 tw-text-center">
                    지역
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3 tw-text-center">
                    연락처
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3 tw-text-center">
                    신청일자
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
                {isSuccess &&
                  [...dataList]
                    .sort((a, b) => (b.is_pending === 1 ? 1 : -1))
                    .slice(0, page * 16)
                    .map((c) => (
                      <tr key={c.advertising_seq} className="">
                        <td className="tw-px-6 tw-py-4 tw-text-center">
                          {c.advertising_seq}
                        </td>
                        <td className="tw-px-6 tw-py-4 tw-text-center">
                          {c.company_name}
                        </td>
                        <td className="tw-px-6 tw-py-4 tw-text-center">
                          {c.area}
                        </td>
                        <td className="tw-px-6 tw-py-4 tw-text-center">
                          {c.contact.replace(
                            /^(\d{2,3})(\d{3,4})(\d{4})$/,
                            `$1-$2-$3`
                          )}
                        </td>
                        <td className="tw-px-6 tw-py-4 tw-text-center">
                          <span className={"tw-text-amber-700"}>
                            {dayjs(c.first_register_date).format("YYYY-MM-DD")}
                          </span>
                        </td>
                        <td className="tw-px-6 tw-py-4 tw-text-center">
                          {c.is_pending === 1 && (
                            <span className={"tw-text-black-500"}>
                              승인대기
                            </span>
                          )}
                          {c.is_pending === 0 && (
                            <span className={"tw-text-blue-500"}>승인완료</span>
                          )}
                          {c.is_pending === -1 && (
                            <span className={"tw-text-red-500"}>승인거절</span>
                          )}
                        </td>
                        <td className="tw-px-6 tw-py-4 tw-text-center tw-flex tw-gap-1">
                          <button
                            className={"laon-btn hover:tw-bg-primary/50"}
                            onClick={() => handleApprove(c.advertising_seq)}
                            disabled={c.is_pending === 0 || c.is_pending === -1}
                          >
                            승인하기
                          </button>
                          <button
                            className={
                              "laon-btn !tw-bg-red-400 hover:!tw-bg-red-400/50"
                            }
                            onClick={() => handleReject(c.advertising_seq)}
                            disabled={c.is_pending === 0 || c.is_pending === -1}
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

export default Advertisement;
