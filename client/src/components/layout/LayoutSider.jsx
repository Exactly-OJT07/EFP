import { DashboardOutlined, UserOutlined, ThunderboltOutlined, LogoutOutlined} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import './LayoutSider.css'
import { useLocation, useNavigate } from "react-router-dom";
import logoIcon from '../../assets/logo.jpg'

const { Sider } = Layout;

// eslint-disable-next-line react/prop-types
export const LayoutSider = ({ collapsed = true }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menu = [
        {
        key: "dashboard",
        icon: <DashboardOutlined />,
        label: 'Dashboard',
        },
        {
        key: "manageUsers",
        icon: <UserOutlined />,
        label: 'Manage Users',
        },
        {
        key: "manageProjects",
        icon: <ThunderboltOutlined />,
        label: 'Manage Projects',
        },
        {
        key: "login",
        icon: <LogoutOutlined />,
        label: 'Login'
        },
    ];

    const { pathname } = location;

    return (
        <Sider theme="dark" trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical">
        <   img src={logoIcon} alt="" 
                style={{
                        width: 65, 
                        height: 65,
                        margin: 10,
                        borderRadius: 10,
                        }}
                />
        </div>
        <Menu
            theme="dark"
            mode="inline"
            items={menu}
            selectedKeys={[pathname.substring(1)]}
            onClick={({ key }) => navigate(key)}
        />
        </Sider>
    );
};