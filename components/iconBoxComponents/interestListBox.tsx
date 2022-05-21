import { FC, useEffect, useState } from "react";
import Icon from "./icon";
import { useRecoilState } from "recoil";
import { userState } from "../../recoil/atoms/userAtom";
import useInput from "../../hooks/useInput";
import {
  AdditionalInputType,
  HandleAdditionalInfoType,
} from "../mypage/mypageInfo";

interface Props {
  handleAdditionalInfo: HandleAdditionalInfoType;
  additionalInfo: AdditionalInputType;
}

const InterestListBox: FC<Props> = ({
  handleAdditionalInfo,
  additionalInfo,
}) => {
  const [iconList, setIconList] = useState([
    {
      id: "UIC0001",
      img: "food",
      text: "맛집",
    },
    {
      id: "UIC0002",
      img: "travel",
      text: "여행/숙박",
    },
    {
      id: "UIC0003",
      img: "beauty",
      text: "뷰티",
    },
    {
      id: "UIC0004",
      img: "life",
      text: "생활/문화",
    },
    {
      id: "UIC0005",
      img: "eat",
      text: "식품",
    },
    {
      id: "UIC0006",
      img: "it",
      text: "디지털",
    },
    {
      id: "UIC0007",
      img: "fashion",
      text: "패션",
    },
    {
      id: "UIC0008",
      img: "baby",
      text: "유아동",
    },
    {
      id: "UIC0009",
      img: "book",
      text: "도서",
    },
    {
      id: "UIC0010",
      img: "pet",
      text: "반려동물",
    },
  ]);

  return (
    <div className={"tw-grid tw-grid-cols-5 tw-w-[60%]"}>
      {iconList.map((i) => (
        <Icon
          key={i.id}
          id={i.id}
          src={`/images/mypageIcons/${i.img}`}
          text={i.text}
          active={additionalInfo.interest.includes(i.id)}
          onClick={() => handleAdditionalInfo("interest", i.id)}
        />
      ))}
    </div>
  );
};
export default InterestListBox;
