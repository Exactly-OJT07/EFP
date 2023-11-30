import { ApartmentOutlined, ExceptionOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";

import { useLocation, useNavigate } from "react-router-dom";

const { Sider } = Layout;

// eslint-disable-next-line react/prop-types
export const LayoutSider = ({ collapsed = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    {
      key: "Option1",
      icon: <ApartmentOutlined />,
      label: "Option 1",
    },
    {
      key: "Option2",
      icon: <ExceptionOutlined />,
      label: "Option 2",
    },
  ];

  const { pathname } = location;

  return (
    <Sider theme="dark" trigger={null} collapsible collapsed={collapsed}>
      <div
        style={{
          backgroundColor: "gray",
          borderRadius: "5px",
          height: "50px",
          margin: "10px",
        }}
      />
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
