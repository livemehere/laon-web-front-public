import { FC, useEffect, useState } from "react";
import Icon from "./icon";
import AreaIcon from "./areaIcon";
import {
  AdditionalInputType,
  HandleAdditionalInfoType,
} from "../mypage/mypageInfo";

interface Props {
  handleAdditionalInfo: HandleAdditionalInfoType;
  additionalInfo: AdditionalInputType;
}

const AreaListBox: FC<Props> = ({ handleAdditionalInfo, additionalInfo }) => {
  // TODO: 여기 id를 코드테이블 값으로 변경해주면됨
  const [areaList, setAreaList] = useState([
    {
      id: "UAC0001",
      area: "서울",
    },
    {
      id: "UAC0002",
      area: "경기",
    },
    {
      id: "UAC0003",
      area: "부산",
    },
    {
      id: "UAC0004",
      area: "인천",
    },
    {
      id: "UAC0005",
      area: "대구",
    },
    {
      id: "UAC0006",
      area: "광주",
    },
    {
      id: "UAC0007",
      area: "울산",
    },
    {
      id: "UAC0008",
      area: "경북",
    },
    {
      id: "UAC0009",
      area: "경남",
    },
    {
      id: "UAC0010",
      area: "전북",
    },
    {
      id: "UAC0011",
      area: "전남",
    },
    {
      id: "UAC0012",
      area: "충북",
    },
    {
      id: "UAC0013",
      area: "충남",
    },
    {
      id: "UAC0014",
      area: "세종",
    },
    {
      id: "UAC0015",
      area: "제주",
    },
  ]);

  return (
    <div className={"tw-grid tw-grid-cols-5 tw-w-[60%] tw-gap-2"}>
      {areaList.map((i) => (
        <AreaIcon
          key={i.id}
          id={i.id}
          area={i.area}
          active={additionalInfo.area.includes(i.id)}
          onClick={() => handleAdditionalInfo("area", i.id)}
        />
      ))}
    </div>
  );
};
export default AreaListBox;
