import { FC } from "react";
import { HandleAdditionalInfoType } from "../mypage/mypageInfo";

interface Props {
  src: string;
  id: string;
  text: string;
  active?: boolean;
  onClick: any;
}

const Icon: FC<Props> = ({ id, src, text, active, onClick }: Props) => {
  return (
    <div className={"tw-cursor-pointer"} onClick={onClick}>
      <div className={"tw-w-[50px] tw-mx-auto"}>
        <img
          src={`${src}${active ? "-active" : ""}.png`}
          alt="icon"
          className={"tw-w[100%] tw-h-[100%]"}
        />
      </div>
      <p className={"tw-text-center"}>{text}</p>
    </div>
  );
};

Icon.defaultProps = {
  active: false,
};

export default Icon;
