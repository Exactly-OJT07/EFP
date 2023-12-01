import { useState } from "react";
import {
    UserOutlined,
    ClockCircleOutlined,
    CheckOutlined,
    CloseOutlined,
    MoreOutlined,
    CalendarOutlined,
    ScheduleOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import {
    Button,
    Typography,
    Card,
    Space,
    Divider,
    Row,
    Col,
    Dropdown,
    Modal,
    Form,
    Input,
    DatePicker,
    message,
    Layout,
    Menu,
    Popconfirm,
} from "antd";
import '../styles/ManageProject.css'
import logoIcon from '../assets/image5.png'

const { Content } = Layout;

const { RangePicker } = DatePicker;

const projects = [
    {
        id: 1,
        projectNumber: "#P-000441425",
        projectName: "Redesign Owlio Landing Page Web",
        personInCharge: "Thành Phản Diện",
        startDate: "Tuesday, Nov 29th 2023",
        endDate: "Tuesday, Dec 16th 2023",
        createdOn: "Nov 29th, 2023",
    },
    {
        id: 2,
        projectNumber: "#P-000112233",
        projectName: "Exactly CocoonVietnam Website",
        personInCharge: "Thành Phản Diện",
        startDate: "Tuesday, Nov 22th 2023",
        endDate: "Tuesday, Dev 17th 2024",
        createdOn: "Dec 1st, 2023",
    },
    // Add more projects as needed
  ];

const handleMenuClick = (e) => {
    message.open({
        type: "success",
        content: "Change action successfully, and it will disappear in 03 seconds",
        duration: 3,
    });
    console.log("click", e);
};

const settings = [
    {
        label: 'View',
        key: 'view',
    },
    {
        label: 'Delete',
        key: 'delete',
    },
];

const items = [
    {
        label: "To Do",
        key: "1",
        icon: <UserOutlined />,
    },
    {
        label: "In Progress",
        key: "2",
        icon: <ClockCircleOutlined />,
    },
    {
        label: "Close",
        key: "3",
        icon: <CloseOutlined />,
        danger: true,
    },
    {
        label: "Done",
        key: "4",
        icon: <CheckOutlined />,
        danger: true,
        disabled: true,
    },
];

const ManageProject = () => {
    const [selectedActionCreate, setSelectedActionCreate] = useState(null);
    const [selectedActionView, setSelectedActionView] = useState(null);

    const menuProps = {
        items,
        onClick: (item) => {
            handleMenuClick(item);
            if (createModalOpen) {
                setSelectedActionCreate(item.key);
            } else if (viewModalOpen) {
                setSelectedActionView(item.key);
            }
        },
    };

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);

    const [confirmLoading, setConfirmLoading] = useState(false);

    const showCreateModal = () => {
        setCreateModalOpen(true);
    };

    const handleCreateOk = () => {
        // Placeholder function for handling create modal OK
        console.log("Create OK");
        setConfirmLoading(true);

        setTimeout(() => {
        setCreateModalOpen(false);
        setConfirmLoading(false);
        }, 2000);
    };

    const handleCreateCancel = () => {
        // Placeholder function for handling create modal cancel
        console.log("Create Cancel");
        setCreateModalOpen(false);
    };

    const showViewModal = () => {
        setViewModalOpen(true);
    };

    const handleViewOk = () => {
        // Placeholder function for handling view modal OK
        console.log("View OK");
        setConfirmLoading(true);

        setTimeout(() => {
        setViewModalOpen(false);
        setConfirmLoading(false);
        }, 2000);
    };

    const handleViewCancel = () => {
        // Placeholder function for handling view modal cancel
        console.log("View Cancel");
        setViewModalOpen(false);
    };

    const [formCreate] = Form.useForm();
    const [formView] = Form.useForm();

    return (
        <Content className="content">
            <Space direction="horizontal" className="status-filter">
            <div className="status">
                <Button type="secondary">All Status</Button>
                <Button type="secondary">On Progress</Button>
                <Button type="secondary">Pending</Button>
                <Button type="secondary">Done</Button>
            </div>
            <Button type="primary" onClick={showCreateModal}>
                <PlusOutlined /> New Project
            </Button>
            </Space>
            <Row gutter={10} style={{ marginTop: 10 }}>
                {projects.map((project) => (
                <Col key={project.id} span={24}>
                    <Card>
                    <Space direction="horizontal">
                        <small>{project.projectNumber}</small>
                    </Space>
                    <div className="project-items">
                        <h4>{project.projectName}</h4>
                        <div className="project-owner">
                        <img
                            src={logoIcon}
                            alt=""
                            style={{ width: 50, height: 50, borderRadius: 100 }}
                        />
                        <div className="project-title">
                            <Typography.Paragraph
                            type="secondary"
                            strong
                            style={{ margin: 0 }}
                            >
                            Person in charge
                            </Typography.Paragraph>
                            <Typography.Text strong style={{ margin: 0 }}>
                            {project.personInCharge}
                            </Typography.Text>
                        </div>
                        </div>

                        <div className="project-owner">
                        <div
                            style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            width: 50,
                            height: 50,
                            background: "#1640D6",
                            }}
                        >
                            <ScheduleOutlined style={{ color: "white" }} />
                        </div>
                        <div className="project-title">
                            <Typography.Paragraph
                            type="secondary"
                            strong
                            style={{ margin: 0 }}
                            >
                            Start Date
                            </Typography.Paragraph>
                            <Typography.Text strong style={{ margin: 0 }}>
                            {project.startDate}
                            </Typography.Text>
                        </div>
                        </div>

                        <div className="project-owner">
                        <div
                            style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            width: 50,
                            height: 50,
                            background: "#1640D6",
                            }}
                        >
                            <ScheduleOutlined style={{ color: "white" }} />
                        </div>
                        <div className="project-title">
                            <Typography.Paragraph
                            type="secondary"
                            strong
                            style={{ margin: 0 }}
                            >
                            End Date
                            </Typography.Paragraph>
                            <Typography.Text strong style={{ margin: 0 }}>
                            {project.endDate}
                            </Typography.Text>
                        </div>
                        </div>
                        <Space wrap>
                        <Dropdown.Button menu={menuProps}>
                            {createModalOpen
                                ? selectedActionCreate
                                    ? items.find((item) => item.key === selectedActionCreate).label
                                    : "Pending"
                                : viewModalOpen
                                    ? selectedActionView
                                        ? items.find((item) => item.key === selectedActionView).label
                                        : "Pending"
                                    : "Pending"
                            }
                            </Dropdown.Button>
                        </Space>

                        <Space wrap>
                        <Dropdown overlay={
                            <Menu>
                                {settings.map(item => {
                                    if (item.type === 'divider') {
                                        return <Menu.Divider key={item.key} />;
                                    }
                                    return (
                                        <Menu.Item key={item.key}>
                                            {item.key === 'delete' ? (
                                                <Popconfirm
                                                    title="Delete the task"
                                                    description="Are you sure to delete this task?"
                                                    onConfirm={() => {
                                                        // Thực hiện xử lý khi người dùng nhấp vào nút "Yes" trong Popconfirm
                                                        console.log('Deleting task...');
                                                        // Gọi hàm để xử lý delete ở đây
                                                    }}
                                                    onCancel={() => {
                                                        // Thực hiện xử lý khi người dùng nhấp vào nút "No" trong Popconfirm
                                                        console.log('Cancelled deleting task.');
                                                    }}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <a onClick={(e) => e.preventDefault()}>{item.label}</a>
                                                </Popconfirm>
                                            ) : (
                                                <a onClick={() => {
                                                    if (item.key === 'view') {
                                                        showViewModal();
                                                    }
                                                }}>{item.label}</a>
                                            )}
                                        </Menu.Item>
                                    );
                                })}
                            </Menu>
                        } trigger={['click']} placement="bottomLeft">
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <MoreOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                        </Space>
                    </div>
                    <Space direction="horizontal">
                        <CalendarOutlined />
                        <small>{project.createdOn}</small>
                    </Space>
                </Card>
                <Divider/>
            </Col>
                ))}
            </Row>

            {/* Create Modal */}
            <Modal
            title="Create Project"
            open={createModalOpen}
            onOk={handleCreateOk}
            confirmLoading={confirmLoading}
            onCancel={handleCreateCancel}
            width="1000px"
            >
            <Form
                form={formCreate}
                name="createProject"
                layout="vertical"
                autoComplete="off"
            >
            <Row gutter={16}>
                <Col xs={24} lg={12}>
                    <Form form={formCreate} name="createProject" layout="vertical" autoComplete="off">
                        <Form.Item
                            name="Name"
                            label="Name"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="Manager"
                            label="Manager"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="StartDate"
                            label="StartDate"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="EndDate"
                            label="EndDate"
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Col>
                <Col xs={24} lg={12}>
                    <Form form={formCreate} name="createProject" layout="vertical" autoComplete="off">
                        <Form.Item
                            name="Description"
                            label="Description"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="LangFrame"
                            label="LangFrame"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="Technology"
                            label="Technology"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="Specification"
                            label="Specification"
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
                <Col xs={24} lg={24} >
                    <Row justify="center">
                    <Col xs={24} lg={12}>
                        <Form.Item name="timeLine" label="Timeline">
                        <RangePicker 
                            style={{ 
                            width: '100%',
                            }} 
                        />
                        </Form.Item>
                    </Col>
                    </Row>
                </Col>
            </Form>
            </Modal>

            {/* Update Modal */}
            <Modal
            title="Project Details"
            open={viewModalOpen}
            onOk={handleViewOk}
            confirmLoading={confirmLoading}
            onCancel={handleViewCancel}
            >
            <Form
                form={formView}
                name="viewProject"
                layout="vertical"
                autoComplete="off"
            >
                <Form.Item name="timeLine" label="Timeline">
                <RangePicker style={{ width: "100%" }} />
                </Form.Item>
            </Form>
            </Modal>
        </Content>
    );
};

export default ManageProject;
