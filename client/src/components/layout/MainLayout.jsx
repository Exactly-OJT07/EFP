import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Spin, theme, Button } from "antd";
import { Suspense, useState } from "react";
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
            margin: 0,
        }}
        >
        <LayoutSider collapsed={collapsed} />
        <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                fontSize: '16px',
                width: 64,
                height: 64,
                }}
            />
                EPM Team
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