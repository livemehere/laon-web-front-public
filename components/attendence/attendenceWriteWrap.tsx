import React, { FormEvent } from "react";
import { Form } from "react-bootstrap";
import useInput from "../../hooks/useInput";
import { useRecoilState } from "recoil";
import { userState } from "../../recoil/atoms/userAtom";
import AxiosManager from "../../util/axiosManager";
import { useRouter } from "next/router";

interface Props {}

const AttendenceWriteWrap: React.FC = ({}: Props) => {
  const { input, handleChange } = useInput({
    content: "",
  });

  const [user, setUser] = useRecoilState(userState);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const seq = user?.user_seq;
    const content = input.content;

    const r = await AxiosManager.post("/users/attendance", {
      user_seq: seq,
      content,
    });
    if (r.status === 200) {
      alert("출석 완료");
      router.back();
    } else {
      alert("이미 출석체크를 하였습니다");
      router.back();
    }
  };
  return (
    <div className="tw-mt-10 tw-pl-10">
      {/* title */}
      <h3 className="tw-mb-5 tw-pb-3 tw-border-black tw-border-b-2">
        출석부 작성
      </h3>
      {/* notice detail */}
      <div>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Control
              as="textarea"
              rows={10}
              value={input.content}
              onChange={(e) => handleChange("content", e.target.value)}
            />
          </Form.Group>
          <button
            className={
              "tw-bg-primary tw-text-white tw-px-10 tw-py-1 tw-float-right"
            }
          >
            작성하기
          </button>
        </Form>
      </div>
    </div>
  );
};

export default AttendenceWriteWrap;
