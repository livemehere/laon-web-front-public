import React from "react";
import { useRouter } from "next/router";

interface Props {
  title: string;
  desc: string;
  href: string;
}

const AdminCard: React.FC<Props> = ({ title, desc, href }) => {
  const router = useRouter();
  const handleRoute = () => {
    router.push(href);
  };

  return (
    <div
      className={
        "tw-border-gray-500  admin_box_shadow tw-p-5 tw-cursor-pointer hover:tw--translate-y-1 tw-transition-transform"
      }
      onClick={handleRoute}
    >
      <h4 className={"tw-text-center"}>{title}</h4>
      <p className={"tw-text-gray-500 tw-text-center"}>{desc}</p>
    </div>
  );
};

export default AdminCard;
