import React, { useState } from "react";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import { noticeState } from "../../recoil/atoms/notice";
import dayjs from "dayjs";
import AxiosManager from "../../util/axiosManager";

interface Props {}

const NoticeContent: React.FC = ({}: Props) => {
  const noticeList = useRecoilValue(noticeState);
  const handleCountView = async (seq: number) => {
    const r = await AxiosManager.patch("/notice/view-count", {
      notice_seq: seq,
    });
  };
  const [page, setPage] = useState(1);
  const handleLoadMoreCampaign = () => {
    const maxPage = Math.ceil(noticeList.length / 10);
    setPage((prev) => {
      return prev + 1 >= maxPage ? maxPage : prev + 1;
    });
  };
  return (
    //  base content wrap
    <div className="tw-mt-10 tw-pl-10">
      {/* title */}
      <h3 className="tw-mb-5 tw-pb-3 tw-border-black tw-border-b-2">
        공지사항{" "}
        <span className={"tw-text-sm"}>
          라온디어스 체험단의 다양한 소식들을 전해드립니다.
        </span>
      </h3>
      {/* notice list */}
      <ul className={"tw-pl-0 tw-divide-y"}>
        {noticeList &&
          noticeList.slice(0, page * 10).map((n) => (
            <li
              key={n.notice_seq}
              className={"hover:tw-text-gray-600 tw-cursor-pointer tw-py-3"}
            >
              <div className={"tw-flex tw-justify-between"}>
                <div className={"tw-flex"}>
                  <div className={"tw-mx-2 tw-min-w-[10px]"}>
                    {n.notice_seq}
                  </div>
                  <div onClick={() => handleCountView(n.notice_seq)}>
                    <span className={"tw-text-blue-400 tw-mx-1"}>[공지]</span>
                    <Link href={`/mypage/notice/${n.notice_seq}`}>
                      {n.title}
                    </Link>
                  </div>
                </div>
                <div className={"tw-flex tw-gap-2"}>
                  <div>
                    {dayjs(n.first_register_date).format("YYYY-MM-DD hh:mm:ss")}
                  </div>
                </div>
              </div>
            </li>
          ))}
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
  );
};

export default NoticeContent;
