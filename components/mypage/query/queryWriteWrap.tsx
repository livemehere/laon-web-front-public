import React, { FormEvent, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import AxiosManager from "../../../util/axiosManager";
import { useRecoilState } from "recoil";
import { userState } from "../../../recoil/atoms/userAtom";
import { useRouter } from "next/router";

interface Props {}

const AttendenceWriteWrap: React.FC<Props> = ({}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [user, setUser] = useRecoilState(userState);
  const router = useRouter();
  const onSubmit: SubmitHandler<any> = async (data) => {
    if (data.title.length === 0) return alert("제목을 입력해주세요");
    const r = await AxiosManager.post("/users/qna", {
      user_seq: user?.user_seq,
      category: data.category,
      title: data.title,
      content: data.content,
    });
    if (r.status === 200) {
      alert("문의가 성공적으로 등록되었습니다");
      router.back();
    }
  };
  const onError: SubmitErrorHandler<any> = (errors) => console.log(errors);

  useEffect(() => {
    reset({
      content:
        "라온디어스 체험단 회원님! 문의를 남겨주시기 전에 먼저 faq를 확인해주세요.\n" +
        "캠페인 관련 문의를 남겨주실 때는 ① 미디어 카테고리 선택 ②캠페인명 선택 후\n" +
        "내용을 기재해 주시면 캠페인 담당자에게 바로 전달되어 빠른 안내가 가능합니다.\n" +
        "캠페인 관련 문의나 카테고리 선택이 불가한 경우,\n" +
        "서비스 이용 항목에서 캠페인명과 상세 내용 남겨주시면 확인 후 안내 도와드리겠습니다.",
    });
  }, []);

  const [textAreaValue, setTextAreaValue] = useState();
  return (
    <div className="tw-mt-10 tw-pl-10">
      {/* title */}
      <h3 className="tw-mb-5 tw-pb-3 tw-border-black tw-border-b-2">
        문의 작성 하기
      </h3>
      {/* notice detail */}
      <div>
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <div className={"tw-flex tw-gap-2"}>
              <div className={"tw-flex-3"}>
                <Form.Select
                  aria-label="Default select example"
                  {...register("category", { required: true })}
                >
                  <option value="일반">일반</option>
                  <option value="캠페인">캠페인</option>
                  <option value="포인트">포인트</option>
                  <option value="프리미엄">프리미엄</option>
                </Form.Select>
              </div>
              <div className={"tw-flex-1"}>
                <Form.Control
                  type="text"
                  placeholder="제목을 입력하세요"
                  {...register("title")}
                />
              </div>
            </div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Control as="textarea" rows={10} {...register("content")} />
          </Form.Group>
          <div className={"tw-flex tw-justify-center tw-gap-1"}>
            <button
              className={
                "tw-bg-primary tw-text-white tw-px-10 tw-py-1 tw-float-right"
              }
              type={"submit"}
            >
              등록
            </button>
            <button
              type={"reset"}
              className={
                "tw-bg-white tw-text-black tw-px-10 tw-py-[3px] tw-float-right tw-border-black tw-border-[1px]"
              }
              onClick={() => router.back()}
            >
              취소
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AttendenceWriteWrap;
