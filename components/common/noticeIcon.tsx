import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

interface NoticeIconProps {
  src: string;
  href: string;
  onClick?: any;
}

const NoticeIcon: React.FC<NoticeIconProps> = ({
  onClick,
  children,
  src,
  href,
}) => {
  return (
    <div className="tw-relative tw-w-[167px] tw-h-[180px] md:tw-m-auto md:tw-mb-2 tw-cursor-pointer">
      <Image src={src} layout="fill" alt={src} onClick={onClick} />
    </div>
  );
};

export default NoticeIcon;
