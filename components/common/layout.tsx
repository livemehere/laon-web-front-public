import React from "react";
import { Container } from "react-bootstrap";

interface LayoutProps {
  children?: JSX.Element | JSX.Element[];
  className?: string;
}

function Layout({ children, className }: LayoutProps) {
  return (
    <div className={className}>
      <Container>{children}</Container>
    </div>
  );
}

export default Layout;
