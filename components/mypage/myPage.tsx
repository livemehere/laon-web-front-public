import React from "react";
import { Col, Row } from "react-bootstrap";
import Footer from "../common/footer";
import Header from "../common/header";
import Layout from "../common/layout";
import MyPageContent from "./mypageContent";
import SideMenu from "../common/sideMenu";

interface MyPageWrapProps {
  content: JSX.Element;
}

const MyPageWrap: React.FC<MyPageWrapProps> = ({ children, content }) => {
  return (
    <>
      <Header />
      <Layout>
        <Row>
          <Col md={3}>
            <SideMenu />
          </Col>
          <Col>{content}</Col>
        </Row>
      </Layout>
      <Footer />
    </>
  );
};

export default MyPageWrap;
