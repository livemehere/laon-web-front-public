import React, { useEffect } from "react";
import { AccuralType, WithDrawType } from "./pointContent";
import dayjs from "dayjs";
import { PointType } from "../../../pages/admin/user/[id]";

interface Props {
  type: "적립" | "출금";
  data: PointType[] | WithDrawType[];
}

const PointTable: React.FC<Props> = ({ type, data }) => {
  const numberWithCommas = (x: number | string) => {
    return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return (
    <div className={"tw-h-[400px] tw-overflow-scroll"}>
      <table className={"tw-w-[100%] "}>
        <thead>
          <tr className={"tw-bg-gray-100 "}>
            <th className={"tw-text-center tw-p-1"}>{`${type}일`}</th>
            <th className={"tw-text-center tw-p-1"}>{`${type}내역`}</th>
            <th className={"tw-text-center tw-p-1"}>포인트</th>
            {type === "출금" && (
              <th className={"tw-text-center tw-p-1"}>상태</th>
            )}
          </tr>
        </thead>
        {/* type이 적립일때와 출금일때를 구분해서 작성해야함 */}
        <tbody>
          {data.length > 0 ? (
            data.map((d: any, idx) => (
              <tr key={idx}>
                <td className={"tw-text-center tw-p-1"}>
                  {dayjs(d.first_register_date).format("YYYY-MM-DD")}
                </td>
                {/* 여기는 포인트 내역이들어오면 그거 쓰면됨*/}
                <td className={"tw-text-center tw-p-1"}>{d.accrual_content}</td>
                <td className={"tw-text-center tw-p-1"}>
                  {type === "적립"
                    ? numberWithCommas(d.accrual_point)
                    : numberWithCommas(d.withdrawal_point)}
                  p
                </td>
                {type === "출금" && (
                  <td className={"tw-text-center tw-p-1"}>
                    {d.is_pending === 0 && "출금완료"}
                    {d.is_pending === 1 && "승인대기"}
                    {d.is_pending === -1 && "반려됨"}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <>
              <tr>
                <td></td>
                <td>
                  <div
                    className={"tw-text-center tw-pt-5"}
                  >{`${type}된 내역이 없습니다.`}</div>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PointTable;
