import React, { useEffect, useState } from "react";
import PenaltyTable from "./penaltyTable";
import { useRecoilState } from "recoil";
import { userState } from "../../../recoil/atoms/userAtom";
import AxiosManager from "../../../util/axiosManager";
import dayjs from "dayjs";

interface MyPageCareProps {}

export interface PenaltyType {
  penalty_seq: number;
  user_seq: number;
  content: string;
  end_date: Date;
  first_register_id: number;
  first_register_date: Date;
  last_register_id: number;
  last_register_date: Date;
}

const MyPageCare: React.FC<MyPageCareProps> = ({ children }) => {
  const [user, setUser] = useRecoilState(userState);
  const [pn, setPn] = useState<PenaltyType[]>([]);

  useEffect(() => {
    (async () => {
      const r = await AxiosManager.get(
        `/users/penalty?user_seq=${user?.user_seq}`
      );
      setPn(r.data.penalty);
    })();
  }, []);

  return (
    <div>
      <PenaltyTable
        list={false}
        pn={pn.filter((p) => dayjs().diff(dayjs(p.end_date)) < 0)} // 차가 0보다 작으면 아직이고, 0보다 크면 지난 날짜임
      />
      <PenaltyTable
        list={true}
        pn={pn.filter((p) => dayjs().diff(dayjs(p.end_date)) > 0)}
      />
    </div>
  );
};

export default MyPageCare;
