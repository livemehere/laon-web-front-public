import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../../../components/common/header";
import Layout from "../../../../components/common/layout";
import dayjs from "dayjs";
import Link from "next/link";
import Footer from "../../../../components/common/footer";
import { useRouter } from "next/router";
import { ApplicantType, CampaignType } from "../../../../recoil/atoms/campaign";
import { GetServerSideProps } from "next";
import AxiosManager from "../../../../util/axiosManager";

interface Props {
  applicants: ApplicantType[];
}

const statusToString = (status: number) => {
  let str = "";
  if (status === 0) str = "신청";
  if (status === 1) str = "선정됨";
  if (status === 2) str = "미션완료";
  return str;
};

const EditInfo: React.FC<Props> = ({ applicants }) => {
  const router = useRouter();
  const [data, setData] = useState<ApplicantType[]>(applicants);
  const [page, setPage] = useState(1);
  const [campData, setCampData] = useState<CampaignType>();
  const id = router.query.id;

  useEffect(() => {
    if (!id) return;
    getCamp();
  }, [router]);

  const getCamp = async () => {
    const r = await AxiosManager.get(`/campaigns?campaign_seq=${id}`);
    if (r.status === 200) {
      setCampData(r.data.campaign);
    } else {
      alert("캠페인 정보 불러오기 실패");
    }
  };

  const getFreshData = async () => {
    const result = await AxiosManager.get("/campaigns/campaign/applicant", {
      campaign_seq: router.query.id,
    });
    const applicants = result.data.applicants;
    setData(applicants);
  };

  const handleLoadMoreCampaign = () => {
    const maxPage = Math.ceil(data.length / 16);
    setPage((prev) => {
      return prev + 1 >= maxPage ? maxPage : prev + 1;
    });
  };

  const handlePick = async (user_seq: number) => {
    const r = await AxiosManager.post("/campaigns/campaign/reviewer", {
      user_seq,
      campaign_seq: router.query.id,
      admin: 99,
    });
    console.log(r);
    getFreshData();
    if (r.status !== 200) {
      return alert(r.response.data.message);
    }
  };

  const handleCancelPick = async (user_seq: number) => {
    const r = await AxiosManager.delete("/campaigns/campaign/reviewer", {
      user_seq,
      campaign_seq: router.query.id,
    });
    console.log(r);
    if (r.status !== 200) {
      return alert(r.response.data.message);
    }
    getFreshData();
  };

  const handleMissionComplete = async (user_seq: number) => {
    const r = await AxiosManager.patch("/campaigns/mission/complete", {
      user_seq,
      campaign_seq: router.query.id,
      admin: 99,
    });
    console.log(r);
    if (r.status !== 200) {
      alert(r.response.data.message);
    } else {
      alert("완료 처리되었습니다(포인트 자동지급)");
    }
    getFreshData();
  };

  useEffect(() => {
    console.log(applicants);
  }, [applicants]);

  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 캠페인 통계</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Header />
        <section className="tw-mb-10 tw-w-[80%] tw-m-auto">
          <div className="tw-relative tw-overflow-x-auto tw-shadow-md sm:tw-rounded-lg tw-mt-10">
            <table className="tw-w-full tw-text-sm tw-text-left tw-text-gray-500 dark:tw-text-gray-400">
              <thead className="tw-text-xs tw-text-gray-700 tw-uppercase tw-bg-gray-50 dark:tw-bg-gray-700 dark:tw-text-gray-400">
                <tr>
                  <th scope="col" className="tw-px-6 tw-py-3">
                    시퀀스
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3">
                    상태
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3">
                    프리미엄 여부
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3">
                    아이디
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3">
                    이름
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3">
                    성별
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3">
                    출생년도
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3">
                    전화번호
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3">
                    기타 작성란
                  </th>
                  <th scope="col" className="tw-px-6 tw-py-3">
                    <span className="">선정하기 / 선정취소 / 완료처리</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.slice(0, page * 16).map((c) => (
                    <tr key={c.user_seq} className="">
                      <td className="tw-px-6 tw-py-4">{c.user_seq}</td>
                      <td className="tw-px-6 tw-py-4">
                        <span
                          className={
                            `${c.status === 0 && " tw-text-black "}` +
                            `${c.status === 1 && " tw-text-green-500 "}` +
                            `${c.status === 2 && " tw-text-blue-500 "}`
                          }
                        >
                          {statusToString(c.status)}
                        </span>
                      </td>
                      <td className="tw-px-6 tw-py-4">
                        {c.is_premium === 1 ? "[프리미엄]" : "[일반]"}
                      </td>
                      <td className="tw-px-6 tw-py-4 tw-text-orange-500">
                        <Link href={`/admin/user/${c.user_seq}`}>
                          {c.id.length > 20 ? `${c.id.slice(0, 20)}...` : c.id}
                        </Link>
                      </td>
                      <td className="tw-px-6 tw-py-4">{c.name}</td>
                      <td className="tw-px-6 tw-py-4">
                        {c.gender === "M" ? "남자" : "여자"}
                      </td>
                      <td className="tw-px-6 tw-py-4">{c.birth}</td>
                      <td className="tw-px-6 tw-py-4">
                        {c.phonenumber.replace(
                          /^(\d{2,3})(\d{3,4})(\d{4})$/,
                          `$1-$2-$3`
                        )}
                      </td>
                      <td className="tw-px-6 tw-py-4">
                        {c.other_answers &&
                          c.other_answers.split("\n").map((c) => (
                            <>
                              {c}
                              <br />
                            </>
                          ))}
                      </td>
                      <td className="tw-px-6 tw-py-4 text-right">
                        <button
                          className="tw-font-medium !tw-text-green-600  hover:tw-underline tw-mr-5"
                          onClick={() => {
                            handlePick(c.user_seq);
                          }}
                        >
                          선정하기
                        </button>
                        <button
                          className="tw-font-medium !tw-text-red-600  hover:tw-underline tw-mr-5"
                          onClick={() => {
                            handleCancelPick(c.user_seq);
                          }}
                        >
                          선정취소
                        </button>
                        <button
                          className="tw-font-medium !tw-text-blue-600  hover:tw-underline tw-mr-5"
                          onClick={() => {
                            handleMissionComplete(c.user_seq);
                          }}
                        >
                          완료처리
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
                캠페인 더불러오기
              </span>
            </div>
          </div>
        </section>
        <Footer />
      </>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id;
  const result = await AxiosManager.get("/campaigns/campaign/applicant", {
    campaign_seq: id,
  });
  const applicants = result.data.applicants;
  return {
    props: { applicants },
  };
};

export default EditInfo;
