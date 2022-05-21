import Link from "next/link";
import React from "react";

interface TextLinkButtonProps {
  url?: string;
  className?: string;
  onClick?: any;
}

const TextLinkButton: React.FC<TextLinkButtonProps> = ({
  children,
  url,
  className,
  onClick,
}) => {
  return (
    <div className={`tw-px-2 ${className} tw-text-gray-400`} onClick={onClick}>
      <Link href={url || "#"}>{children}</Link>
    </div>
  );
};

export default TextLinkButton;
