import React, { useEffect, useState } from "react";
import TabMemu from "../../common/tabmenu";
import MyPageInfo from "../mypageInfo";
import MyPageCare from "../mypageCare/mypageCare";
import PointTable from "./pointTable";
import AxiosManager from "../../../util/axiosManager";
import { useRecoilState } from "recoil";
import { userState } from "../../../recoil/atoms/userAtom";
import { PointType } from "../../../pages/admin/user/[id]";
import WithdrawalMoal from "./withdrawalModal";

interface Props {}

export interface AccuralType {
  accrual_point: number;
  accrual_point_date: Date;
  accrual_seq: number;
  first_register_date: Date;
  first_register_id: number;
  id: string;
  name: string;
  user_seq: number;
}

export interface WithDrawType {
  first_register_date: Date;
  first_register_id: number;
  is_pending: number;
  last_register_date: Date;
  last_register_id: number;
  request_seq: number;
  user_seq: number;
  withdrawal_point: number;
}

const PointContent: React.FC<Props> = ({}) => {
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState("적립내역");
  const [user, setUser] = useRecoilState(userState);
  const [points, setPoints] = useState<PointType[]>([]); // 적립내역
  const [requestPointList, setRequestPointList] = useState<WithDrawType[]>([]); //출금내역

  const handleTabChange = (selected: string) => {
    setTab(selected);
  };

  const getPointList = async (seq: number) => {
    const r = await AxiosManager.get(
      `/users/point/accrual/user?user_seq=${seq}`
    );
    setPoints(r.data.accrualList);
  };

  const getRequestPointList = async (seq: number) => {
    const r = await AxiosManager.get(
      `/users/point/withdrawal/user?user_seq=${seq}`
    );
    setRequestPointList(r.data.withdrawalRequestList);
  };
  const numberWithCommas = (x: number | string) => {
    return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  useEffect(() => {
    if (!user) return;

    getPointList(user.user_seq);
    getRequestPointList(user.user_seq);
  }, [user]);

  return (
    <div className="tw-mt-10 tw-pl-10">
      <WithdrawalMoal
        setShow={setShow}
        user_seq={user?.user_seq!}
        name={user?.name!}
        show={show}
      />
      {/* title */}
      <h3 className="tw-mb-5 tw-flex tw-justify-between tw-pb-3 tw-border-black tw-border-b-2">
        나의 포인트
      </h3>
      <div>
        <div
          className={
            "tw-flex tw-justify-center tw-gap-10 tw-divide-x-2 tw-divide-black"
          }
        >
          <div className={"tw-text-center tw-flex-1 tw-p-10"}>
            <h5>현재 포인트</h5>
            <h1>{numberWithCommas(Number(user?.point))} P</h1>
          </div>
          <div className={"tw-text-center tw-flex-1 tw-p-10"}>
            <h5>누적 포인트</h5>
            <h1>{numberWithCommas(Number(user?.accumulated_point))} P</h1>
          </div>
        </div>
        <div className={"tw-float-right"}>
          <button
            className={"laon-btn tw-px-5"}
            onClick={() => setShow((prev) => true)}
          >
            출금신청
          </button>
        </div>
      </div>
      <TabMemu
        menuList={["적립내역", "출금내역"]}
        selected={tab}
        handleClick={handleTabChange}
        className={"!tw-justify-start tw-mt-10"}
      />
      <div className="tw-pt-10 tw-border-b-2 tw-border-gray-100 tw-pb-10">
        {tab === "적립내역" && <PointTable type={"적립"} data={points} />}
        {tab === "출금내역" && (
          <PointTable type={"출금"} data={requestPointList} />
        )}
      </div>
      <div className={"tw-mt-10"}>
        <p>
          · 라온디어스 포인트는 한 달에 3번 신청이 가능하며, 신청 마감일 5일 후
          지급됩니다. (지급일이 공휴일인 경우, 다음 영업일에 지급됩니다.) <br />
          · 신청 기간 및 지급일 안내 (1일 ~ 10일, 당월 15일 지급), (11일 ~ 20일,
          당월 25일 지급), (21일 ~ 말일, 익월 5일 지급) <br />· 출금 금액을
          지정하여 신청이 불가하며, 신청 정보와 금액 수정을 원하실 경우, 앞선
          신청을 취소하시고 다시 신청해 주세요. <br />· 입금계좌의 예금주는
          반드시 실명과 동일해야 지급됩니다.
          <br /> · 입금액은 관련 법상 사업소득에 따른 세금 3.3%를 공제하고
          입금되며 입금된 날짜를 기준으로 소득이 발생한 것으로 신고됩니다.{" "}
          <br />· 명의도용 차단이 되어 있거나 나이스평가정보에서 사용자 정보를
          불러올 수 없는 경우, 나이스평가정보의 고객상담 센터(1588-2486) 또는
          온라인 실명 등록 서비스 를 이용하세요.
        </p>
      </div>
    </div>
  );
};

export default PointContent;
