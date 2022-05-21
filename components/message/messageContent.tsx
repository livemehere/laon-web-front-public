import React, { useEffect, useState } from "react";
import Link from "next/link";
import AxiosManager from "../../util/axiosManager";
import { useRecoilState } from "recoil";
import { userState } from "../../recoil/atoms/userAtom";
import dayjs from "dayjs";

interface Props {}

export interface MessageType {
  message_seq: number;
  content: string;
  is_read: number;
  receiver: number;
  first_register_id: number;
  first_register_date: Date;
}

const MessageContent: React.FC = ({}: Props) => {
  const [user, setUser] = useRecoilState(userState);
  // 페이지네이션에 필요한 3가지 배열,현제페이지,배열 총갯수
  const [msg, setMsg] = useState<MessageType[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      const r = await AxiosManager.get(
        `/users/message?user_seq=${user?.user_seq}`
      );
      // 시간순서대로 정렬해서 넣기(최신순)
      setMsg(
        r.data.messageList.receiveList.sort((a: any, b: any) =>
          dayjs(b.first_register_date).diff(a.first_register_date)
        )
      );
    })();
  }, [user]);

  const handleRead = async (seq: number, is_read: number) => {
    if (is_read === 1) return;
    const r = await AxiosManager.patch("/users/message", {
      message_seq: seq,
      user_seq: user?.user_seq,
    });
    if (r.status === 200) {
      const r = await AxiosManager.get(
        `/users/message?user_seq=${user?.user_seq}`
      );

      setMsg(r.data.messageList.receiveList.reverse());
    }
  };

  const handleReadAll = async () => {
    const r = await AxiosManager.patch(
      `/users/message/all?user_seq=${user?.user_seq}`
    );

    if (r.status === 200) {
      const r = await AxiosManager.get(
        `/users/message?user_seq=${user?.user_seq}`
      );

      setMsg(r.data.messageList.receiveList.reverse());
    }
  };
  const handleLoadMoreCampaign = () => {
    const maxPage = Math.ceil(msg.length / 10);
    setPage((prev) => {
      return prev + 1 >= maxPage ? maxPage : prev + 1;
    });
  };

  return (
    <div className="tw-mt-10 tw-pl-10">
      {/* title */}
      <h3 className="tw-mb-5 tw-flex tw-justify-between tw-pb-3 tw-border-black tw-border-b-2">
        메세지함
        <button
          className={
            "tw-text-sm tw-border-[1px] tw-border-black tw-rounded-full tw-px-1"
          }
          onClick={handleReadAll}
        >
          모두 읽음 표시
        </button>
      </h3>
      {/* notice list */}
      <ul className={"tw-pl-0 tw-divide-y"}>
        {msg.length > 0 &&
          msg.slice(0, page * 10).map((m, idx) => (
            <li
              key={m.message_seq}
              className={"hover:tw-text-gray-600 tw-cursor-pointer tw-py-3"}
            >
              <div className={"tw-flex tw-justify-between"}>
                <div className={"tw-flex"}>
                  <div className={"tw-mx-2"}>{idx + 1}</div>
                  <div>
                    {/*<Link href={`/mypage/message/${m.message_seq}`}>*/}
                    <span
                      onClick={() => handleRead(m.message_seq, m.is_read)}
                      className={"tw-block tw-max-w-[550px]"}
                    >
                      <span className={"tw-text-blue-400 tw-mx-1"}>
                        {m.is_read === 1 ? "[읽음]" : ""}
                      </span>
                      {m.content}
                    </span>
                    {/*</Link>*/}
                  </div>
                </div>
                <div className={"tw-flex tw-gap-2"}>
                  <div>
                    {dayjs(m.first_register_date).format("YYYY-MM-DD hh:mm:ss")}
                  </div>
                  <div className={"tw-text-gray-500"}>{m.message_seq}</div>
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

export default MessageContent;
