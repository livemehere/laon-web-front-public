import { FC } from "react";

interface Props {
  id: string;
  area: string;
  active?: boolean;
  onClick: any;
}

const AreaIcon: FC<Props> = ({ id, area, active, onClick }: Props) => {
  return (
    <div className={"tw-cursor-pointer"} onClick={onClick}>
      <div className={"tw-w-[50px] tw-mx-auto"}>
        <p
          className={`tw-text-center tw-border-black tw-border-[2px] tw-rounded-2xl tw-font-bold tw-mb-0 ${
            active ? "tw-border-blue-900 tw-text-blue-900" : ""
          }`}
        >
          {area}
        </p>
      </div>
    </div>
  );
};

AreaIcon.defaultProps = {
  active: false,
};

export default AreaIcon;
