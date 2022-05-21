import React from "react";
import { PenaltyType } from "./mypageCare";
import dayjs from "dayjs";

interface Props {
  list: boolean;
  pn: PenaltyType[];
}

const PenaltyTable: React.FC<Props> = ({ list, pn }) => {
  return (
    <div
      className={
        "tw-h-[500px] tw-border-b-2 tw-border-gray-200 tw-mb-3 tw-overflow-scroll"
      }
    >
      <h3>{list ? "패널티 이력" : "페널티 현황"}</h3>
      <table className={"tw-w-[100%]"}>
        <thead>
          <tr>
            <th className={"tw-w-[70%] tw-text-center"}>내용</th>
            <th className={"tw-text-center"}>시작 날짜</th>
            <th className={"tw-text-center"}>해제 날짜</th>
          </tr>
        </thead>
        <tbody className={""}>
          {pn.length == 0 ? (
            <tr className={""}>
              <div className={"tw-mt-10 tw-text-center"}>
                보유중인 패널티가 없습니다.
              </div>
            </tr>
          ) : (
            pn.map((p) => (
              <tr key={p.penalty_seq}>
                <td className={"tw-w-[70%] tw-text-start tw-pl-5"}>
                  {p.content}
                </td>
                <td className={"tw-text-center"}>
                  {dayjs(p.first_register_date).format("YYYY-MM-DD")}
                </td>
                <td className={"tw-text-center"}>
                  {dayjs(p.end_date).format("YYYY-MM-DD")}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PenaltyTable;
