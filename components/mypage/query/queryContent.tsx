import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { userState } from "../../../recoil/atoms/userAtom";
import AxiosManager from "../../../util/axiosManager";
import { Accordion } from "react-bootstrap";
import dayjs from "dayjs";

interface Props {}

export interface QuestionType {
  qna_seq: number;
  author: number;
  category: string;
  title: string;
  content: string;
  first_register_id: number;
  first_register_date: string;
  name: string;
}

export interface AnswerType {
  answer_seq: number;
  author: number;
  content: string;
  first_register_date: Date;
  first_register_id: number;
  last_register_date: Date;
  last_register_id: number;
  qna_seq: number;
  title: string;
}

export interface QnAType {
  question: QuestionType;
  answer: AnswerType[];
}

const QueryContent: React.FC<Props> = ({}) => {
  const [user, setUser] = useRecoilState(userState);
  const [qna, setQna] = useState<QnAType[]>([]);
  const [page, setPage] = useState(1);

  const getMyQuery = async (seq: number) => {
    const r = await AxiosManager.get("/users/qna/user", {
      user_seq: seq,
    });
    if (r.status === 200) {
      setQna(r.data.qna_list);
    }
  };

  useEffect(() => {
    getMyQuery(user?.user_seq!);
  }, [user]);

  const handleLoadMoreCampaign = () => {
    const maxPage = Math.ceil(qna.length / 10);
    setPage((prev) => {
      return prev + 1 >= maxPage ? maxPage : prev + 1;
    });
  };
  return (
    <>
      <div className="tw-mt-10 tw-pl-10">
        {/* title */}
        <h3 className="tw-mb-5 tw-flex tw-justify-between tw-pb-3 tw-border-black tw-border-b-2">
          <span>
            1:1문의{" "}
            <span className={"tw-text-sm"}>
              라온디어스 체험단에 대해 궁금한 모든 것을 물어보세요!
            </span>
          </span>
          <Link href={"/mypage/query/write"}>
            <button
              className={
                "tw-bg-black tw-text-white tw-text-sm tw-px-10 tw-py-2"
              }
            >
              1:1 문의하기
            </button>
          </Link>
        </h3>

        {/* notice list */}
        <ul className={"tw-pl-0 tw-divide-y"}>
          <Accordion defaultActiveKey="0">
            {qna &&
              qna.slice(0, page * 10).map((n) => (
                <Accordion.Item
                  key={n.question.qna_seq}
                  eventKey={n.question.qna_seq.toString()}
                  as={"div"}
                >
                  <Accordion.Header className={""}>
                    <div>
                      <span className={"tw-text-sm tw-mr-2 tw-text-primary"}>
                        [{n.question.category}]
                      </span>
                      {n.question.title}
                      {n.answer.length > 0 && (
                        <span className={"tw-text-red-400 tw-ml-1"}>
                          [답변완료]
                        </span>
                      )}{" "}
                    </div>
                    <div className={"tw-ml-2 tw-text-black/30 tw-text-sm"}>
                      {dayjs(n.question.first_register_date).format(
                        "YYYY-MM-DD hh:mm"
                      )}
                      <span className={"tw-ml-1"}>등록</span>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body
                    className={"tw-border-b-[1px] tw-border-black/10"}
                  >
                    <h5> {n.question.title}</h5>
                    {n.question.content?.split("\n").map((c) => (
                      <>
                        {c}
                        <br />
                      </>
                    ))}
                  </Accordion.Body>
                  {n.answer.length > 0 && (
                    <Accordion.Body>
                      <h5>
                        {n.answer[0].title}{" "}
                        <span className={"tw-ml-5 tw-text-black/30 tw-text-sm"}>
                          {dayjs(n.answer[0].first_register_date).format(
                            "YYYY-MM-DD hh:mm"
                          )}
                          <span className={"tw-ml-1"}>답변</span>
                        </span>
                      </h5>
                      {n.answer[0].content?.split("\n").map((c) => (
                        <>
                          {c}
                          <br />
                        </>
                      ))}
                    </Accordion.Body>
                  )}
                </Accordion.Item>
              ))}
          </Accordion>
        </ul>
        {/* page nation 이거는 그냥 전체 불러와서 slice로 구현하면될듯, 굳이 페이지네이션 구현하지 말고 */}
        <div
          className={"!tw-mt-6 tw-flex tw-justify-center"}
          onClick={handleLoadMoreCampaign}
        >
          <span className="tw-cursor-pointer tw-py-2 tw-ml-0 tw-leading-tight tw-text-gray-500 tw-bg-white tw-rounded-lg tw-border tw-border-gray-300 tw-hover:bg-gray-100 hover:tw-text-gray-700 tw-w-[100%] tw-text-center">
            메세지 더불러오기
          </span>
        </div>
      </div>
    </>
  );
};

export default QueryContent;
