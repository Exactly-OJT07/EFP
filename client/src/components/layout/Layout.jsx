import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Col, Layout, Row, Spin, theme } from "antd";
import { Suspense, createElement, useState } from "react";
import { Outlet } from "react-router-dom";
import { LayoutSider } from "./LayoutSider";

const { Content, Header } = Layout;

export const PrivateLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout
      style={{
        overflow: "hidden",
        height: "100vh",
        padding: 0,
      }}
    >
      <LayoutSider collapsed={collapsed} />
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Row align="middle">
            <Col span={12}>
              {createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: () => setCollapsed(!collapsed),
                }
              )}
            </Col>
            <Col span={12}>{/* <DropProfile /> */}</Col>
          </Row>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Suspense fallback={<Spin />}>
            <Outlet />
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};
