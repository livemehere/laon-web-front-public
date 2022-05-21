import React from "react";

interface Props {}

const BlogBadge: React.FC<Props> = ({}) => {
  return (
    <span
      className={
        "tw-text-green-500 tw-mr-1 tw-text-sm tw-border-[1px] tw-border-green-500 tw-px-1"
      }
    >
      BLOG
    </span>
  );
};

export default BlogBadge;
