import Link from "next/link";
import React, { useEffect } from "react";
import { NoticeType } from "../../recoil/atoms/notice";
import AxiosManager from "../../util/axiosManager";
import dayjs from "dayjs";

interface NoticeBoxProps {
  notices: NoticeType[];
}

const NoticeBox: React.FC<NoticeBoxProps> = ({ children, notices }) => {
  const handleCountView = async (seq: number) => {
    const r = await AxiosManager.patch("/notice/view-count", {
      notice_seq: seq,
    });
  };

  return (
    <div className="tw-bg-white tw-p-5 tw-border-3 tw-border-black tw-flex-1 md:tw-mb-2">
      <div className="tw-flex tw-justify-between tw-border-b-2 tw-border-black">
        <h5>공지사항</h5>
        <p className="tw-my-0 hover:tw-cursor-pointer">
          <Link href={"/mypage/notice"}>more</Link>
        </p>
      </div>
      <div>
        <ul className="tw-px-0 tw-py-2 tw-text-sm tw-mb-0 tw-min-h-[100px]">
          {notices.slice(0, 4).map((n) => (
            <li
              key={n.notice_seq}
              className={"hover:tw-text-gray-600"}
              onClick={() => handleCountView(n.notice_seq)}
            >
              <Link href={`/mypage/notice/${n.notice_seq}`}>{n.title}</Link>
              <span className={"tw-float-right tw-text-black/40"}>
                {dayjs(n.first_register_date).format("YYYY-MM-DD hh:mm")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NoticeBox;
