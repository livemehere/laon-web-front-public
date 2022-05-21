import React from "react";
import Link from "next/link";
import Divider from "../common/divider";

interface Props {}

const NoticeDetailWrap: React.FC = ({}: Props) => {
  return (
    <div className="tw-mt-10 tw-pl-10">
      {/* title */}
      <h3 className="tw-mb-5 tw-pb-3 tw-border-black tw-border-b-2">
        메세지 제목
      </h3>
      {/* notice detail */}
      <div>내용</div>
    </div>
  );
};

export default NoticeDetailWrap;
