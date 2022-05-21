import React, { useState } from "react";
import { QnAType } from "../mypage/query/queryContent";
import { convertError } from "@typescript-eslint/typescript-estree/dist/convert";
import AxiosManager from "../../util/axiosManager";

interface Props {
  qna: QnAType;
  getFreshQna: any;
}

const QnaAnswerBox: React.FC<Props> = ({ qna, getFreshQna }) => {
  const [title, setTitle] = useState(
    (qna.answer.length > 0 && qna.answer[0].title) || ""
  );
  const [content, setContent] = useState(
    (qna.answer.length > 0 && qna.answer[0].content) || ""
  );

  const handleSave = async () => {
    const r = await AxiosManager.post("/users/qna/answer", {
      qna_seq: qna.question.qna_seq,
      user_seq: 99,
      title,
      content,
    });
    console.log(r);
    if (r.status === 200) {
      alert("답변이 등록되었습니다.");
      getFreshQna();
    } else {
      alert("답변 등록 중 오류가 발생하였습니다.");
    }
  };

  const handleModify = async () => {
    console.log(qna.question.qna_seq, title, content);
    const r = await AxiosManager.patch("/users/qna/answer", {
      answer_seq: qna.answer[0].answer_seq,
      user_seq: 99,
      title,
      content,
    });

    console.log(qna.answer);
    if (r.status === 200) {
      alert("답변이 수정되었습니다.");
      getFreshQna();
    } else {
      alert("답변 수정 중 오류가 발생하였습니다.");
    }
  };

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (qna.answer.length <= 0) {
            handleSave();
          } else {
            handleModify();
          }
        }}
      >
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300 tw-mb-2"
        />
        <textarea
          placeholder={"내용을 작성해주세요"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={
            "tw-w-[100%] tw-border-black/20 tw-border-[1px] tw-min-h-[10rem] tw-mb-2 tw-p-2"
          }
        />
        <button className={"tw-bg-primary tw-w-[100%] tw-py-2 tw-text-white"}>
          답변 저장
        </button>
      </form>
    </div>
  );
};

export default QnaAnswerBox;
