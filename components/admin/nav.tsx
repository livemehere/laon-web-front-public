import React from "react";
import { Nav } from "react-bootstrap";
import useLogout from "../../hooks/useLogout";

interface Props {}

const AdminNav: React.FC<Props> = ({}) => {
  const handleLogout = useLogout();
  return (
    <Nav fill variant="tabs" defaultActiveKey="/home">
      <Nav.Item>
        <h4 className={"tw-mt-2"}>라온디어스 체험단 관리자 페이지</h4>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-1">Loooonger NavLink</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-2" onClick={handleLogout}>
          로그아웃
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default AdminNav;
