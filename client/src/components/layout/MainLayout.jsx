import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Spin, theme, Button } from "antd";
import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { LayoutSider } from "./LayoutSider";
import logoIcon from '../../assets/avatar1.jpg'

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
            height: "120vh",
            padding: 0,
            margin: 0,
        }}
        >
        <LayoutSider collapsed={collapsed} />
        <Layout>
        <Header style={{ height: 60,padding: 0, background: colorBgContainer , display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
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
                <img
                    src={logoIcon}
                    alt=""
                    style={{ width: 50, height: 50, borderRadius: 50, marginRight: 30, border: '3px solid #E7BCDE', padding: 2}}
                />
            </Header>
            <Content
            style={{
                margin: "24px 16px",
                padding: 24,
                height: '100%',
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