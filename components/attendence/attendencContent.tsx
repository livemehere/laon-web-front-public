import React, { useEffect, useState } from "react";
import Link from "next/link";
import AxiosManager from "../../util/axiosManager";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { userState } from "../../recoil/atoms/userAtom";
import dayjs from "dayjs";

interface Props {}

//TODO: 출첵목록 전체로받아오고, 프사, 닉네임 포함되서올꺼임
interface AttendenceType {
  attendance_seq: number;
  content: string;
  name: string;
  first_register_date: Date;
  first_register_id: number;
  last_register_date: Date;
  last_register_id: number;
  user_seq: number;
  profile_path: string | null;
  nickname: string;
}

const AttendenceContent: React.FC = ({}: Props) => {
  const [user, setUser] = useRecoilState(userState);
  const [atten, setAtten] = useState<AttendenceType[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      const r = await AxiosManager.get(`/users/attendance/all`);
      // 최근 순서대로 정렬해서 넣기
      setAtten(
        r.data.attendanceList.sort((a: any, b: any) =>
          dayjs(b.first_register_date).diff(a.first_register_date)
        )
      );
    })();
  }, [user]);

  const handleLoadMoreCampaign = () => {
    const maxPage = Math.ceil(atten.length / 10);
    setPage((prev) => {
      return prev + 1 >= maxPage ? maxPage : prev + 1;
    });
  };

  return (
    <>
      {" "}
      <div className="tw-mt-10 tw-pl-10">
        {/* title */}
        <h3 className="tw-mb-5 tw-flex tw-justify-between tw-pb-3 tw-border-black tw-border-b-2">
          <span>
            출석부 <span className={"tw-text-sm"}>하루에 한번!</span>
          </span>
          <Link href={"/mypage/attendence/write"}>
            <button
              className={
                "tw-bg-primary tw-text-white tw-text-sm tw-px-10 tw-py-2"
              }
            >
              글 등록하기
            </button>
          </Link>
        </h3>
        {/* notice list */}
        <ul className={"tw-pl-0 tw-divide-y"}>
          {atten.slice(0, page * 10).map((n) => (
            <li
              key={n.attendance_seq}
              className={"hover:tw-text-gray-600 tw-cursor-pointer tw-py-3"}
            >
              <div className={"tw-flex tw-justify-between"}>
                <div className={"tw-flex"}>
                  <div className={"tw-flex"}>
                    <div className={"!tw-min-w-[120px]"}>
                      <div className={"!tw-w-[50px] !tw-h-[50px] tw-m-auto"}>
                        <img
                          className={
                            "tw-object-cover tw-rounded-full tw-w-[100%] tw-h-[100%]"
                          }
                          src={n.profile_path || "/images/userIcon.png"}
                          alt="avatar"
                        />
                      </div>
                      <p
                        className={
                          "tw-mb-0 tw-text-gray-500 tw-text-center tw-text-sm"
                        }
                      >
                        {n.nickname}
                      </p>
                    </div>
                    <div>
                      <p
                        className={"tw-mb-0 tw-block tw-max-w-[550px] tw-ml-2"}
                      >
                        {/*<Link href={`/mypage/attendence/${n.attendance_seq}`}>*/}
                        {n.content}
                        {/*</Link>*/}
                      </p>
                    </div>
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
            더불러오기
          </span>
        </div>
      </div>
    </>
  );
};

export default AttendenceContent;
