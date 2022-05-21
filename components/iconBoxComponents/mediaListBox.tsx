import { FC, useEffect, useState } from "react";
import Icon from "./icon";
import {
  AdditionalInputType,
  HandleAdditionalInfoType,
} from "../mypage/mypageInfo";

interface Props {
  handleAdditionalInfo: HandleAdditionalInfoType;
  additionalInfo: AdditionalInputType;
}

const MediaListBox: FC<Props> = ({
  handleAdditionalInfo,
  additionalInfo,
}: Props) => {
  const [iconList, setIconList] = useState([
    { id: "UCC0001", img: "all", text: "전체" },
    { id: "UCC0002", img: "blog", text: "블로그" },
    {
      id: "UCC0003",
      img: "instagram",
      text: "인스타그램",
    },
    {
      id: "UCC0004",
      img: "youtube",
      text: "유튜브",
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
          active={additionalInfo.channel.includes(i.id)}
          onClick={() => handleAdditionalInfo("channel", i.id)}
        />
      ))}
    </div>
  );
};
export default MediaListBox;
