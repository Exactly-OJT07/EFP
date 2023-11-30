import { useState } from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    DashboardOutlined,
    ThunderboltOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import "../layout/MainLayout.css";
import {Outlet, Link} from 'react-router-dom'

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

return (
    <Layout className="container">
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="demo-logo-vertical" />
            <p>Main Menu</p>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" icon={<DashboardOutlined />} title="Dashboard">
                    <Link to='/'>Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<ThunderboltOutlined />} title="Manage Projects">
                    <Link to='/manage-project'>Manage Projects</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<UserOutlined />} title="Manage Employees">
                    <Link to='/manage-employee'>Manage Employees</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<LogoutOutlined />} title="Logout">
                    <Link to='/logout'>Logout</Link>
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout>
            <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                }}
            />
            EPM Team
            </Header>
            <Content
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                    background: colorBgContainer,
                }}>
                <h1>123456</h1>
                <Outlet />
            </Content>
        </Layout>
        </Layout>
    );
};
export default MainLayout;
