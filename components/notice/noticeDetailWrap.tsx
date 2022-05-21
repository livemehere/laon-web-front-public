import React, { useEffect } from "react";
import Link from "next/link";
import Divider from "../common/divider";
import { NoticeType } from "../../recoil/atoms/notice";
import dayjs from "dayjs";
import AxiosManager from "../../util/axiosManager";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { userState } from "../../recoil/atoms/userAtom";

interface Props {
  n: NoticeType;
}

const NoticeDetailWrap: React.FC<Props> = ({ n }) => {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const handleDelete = async (seq: number) => {
    const r = await AxiosManager.delete("/notice", {
      notice_seq: seq,
    });
    console.log(r);
    if (r.status === 200) {
      alert("삭제되었습니다.");
      router.back();
    } else {
      alert("삭제중 오류가 발생하였습니다.");
    }
  };
  return (
    <div className="tw-mt-10 tw-pl-10">
      {/* title */}
      <h3 className="tw-mb-5 tw-pb-2 tw-border-b-[1.5px] tw-border-black-200">
        {n.title}
      </h3>
      <div className={"tw-flex tw-justify-between tw-mb-2"}>
        <p className={"tw-text-gray-500"}>
          {dayjs(n.first_register_date).format("YYYY년 MM월 DD일 hh:mm:ss")}{" "}
          <span>작성</span>
          {user?.is_admin === 1 ? (
            <span
              className={"tw-ml-1 tw-text-red-600 tw-cursor-pointer"}
              onClick={() => handleDelete(n.notice_seq)}
            >
              삭제
            </span>
          ) : null}
        </p>
        <p>작성자 : 관리자</p>
      </div>
      {/* notice detail */}
      <div className={" tw-min-h-[600px] "}>
        {n.content.split("\n").map((c) => (
          <>
            {c}
            <br />
          </>
        ))}
      </div>
    </div>
  );
};

export default NoticeDetailWrap;
