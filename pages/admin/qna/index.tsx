import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../../components/common/header";
import Layout from "../../../components/common/layout";
import Footer from "../../../components/common/footer";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import AxiosManager from "../../../util/axiosManager";
import { QnAType } from "../../../components/mypage/query/queryContent";
import { Accordion } from "react-bootstrap";
import QnaAnswerBox from "../../../components/admin/qnaAnswerBox";
import dayjs from "dayjs";
import Link from "next/link";

interface Props {
  qnaList: QnAType[];
}

const QnaList: React.FC<Props> = ({ qnaList }) => {
  const router = useRouter();
  const [data, setData] = useState(qnaList);
  const [page, setPage] = useState(1);
  const handleLoadMoreCampaign = () => {
    const maxPage = Math.ceil(qnaList.length / 16);
    setPage((prev) => {
      return prev + 1 >= maxPage ? maxPage : prev + 1;
    });
  };

  console.log(qnaList);

  const getFreshQna = async () => {
    const result = await AxiosManager.get("/users/qna/list");
    setData(result.data.qna_list);
  };

  const handleShowOnlyNoAnswer = () => {
    setData([...data].filter((d) => d.answer.length === 0));
  };

  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 1대1 문의 리스트</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Header />
        <Layout>
          <h2 className={"tw-mt-10  "}>
            <span className={"tw-flex tw-items-center tw-gap-3"}>
              <span>1:1 문의 리스트</span>
              <button
                className={"laon-btn !tw-w-[150px] tw-text-sm "}
                onClick={handleShowOnlyNoAnswer}
              >
                미답변 질문만 보기
              </button>
            </span>
          </h2>
          <div>
            <Accordion>
              {data &&
                data
                  .sort((a, b) =>
                    dayjs(b.question.first_register_date).diff(
                      a.question.first_register_date,
                      "d"
                    )
                  )
                  .slice(0, page * 16)
                  .map((n) => (
                    <Accordion.Item
                      key={n.question.qna_seq}
                      eventKey={n.question.qna_seq.toString()}
                    >
                      <Accordion.Header className={""}>
                        <span className={"tw-text-sm tw-mr-2 tw-text-primary"}>
                          [{n.question.category}]
                        </span>
                        {n.question.title}
                        {n.answer[0] && (
                          <span className={"tw-text-red-600 tw-ml-1"}>
                            [답변완료]
                          </span>
                        )}
                        <span className={"tw-text-black/40 tw-ml-1 tw-text-sm"}>
                          {dayjs(n.question.first_register_date).format(
                            "YYYY-MM-DD hh:mm"
                          )}
                        </span>
                      </Accordion.Header>
                      {
                        <Accordion.Body
                          className={"tw-border-b-[1px] tw-border-black/10"}
                        >
                          <p>
                            질문자 :{" "}
                            <Link href={`/admin/user/${n.question.author}`}>
                              <span
                                className={
                                  "tw-text-orange-500 tw-font-bold hover:tw-underline tw-cursor-pointer"
                                }
                              >
                                {n.question.name}
                              </span>
                            </Link>
                          </p>
                          <p>
                            {n.question.content?.split("\n").map((c) => (
                              <>
                                {c}
                                <br />
                              </>
                            ))}
                          </p>
                          <QnaAnswerBox qna={n} getFreshQna={getFreshQna} />
                        </Accordion.Body>
                      }
                    </Accordion.Item>
                  ))}
            </Accordion>
          </div>
          <div
            className={"!tw-mt-6 tw-flex tw-justify-center"}
            onClick={handleLoadMoreCampaign}
          >
            <span className="tw-cursor-pointer tw-py-2 tw-ml-0 tw-leading-tight tw-text-gray-500 tw-bg-white tw-rounded-lg tw-border tw-border-gray-300 tw-hover:bg-gray-100 hover:tw-text-gray-700 tw-w-[100%] tw-text-center">
              캠페인 더불러오기
            </span>
          </div>
        </Layout>
        <Footer />
      </>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const result = await AxiosManager.get("/users/qna/list");

  return {
    props: { qnaList: result.data.qna_list },
  };
};

export default QnaList;
