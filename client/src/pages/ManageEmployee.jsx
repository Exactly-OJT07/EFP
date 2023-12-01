import React, { useState } from 'react';
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Table, Tag, Dropdown, Button, Input, Radio, Upload, Space, Modal, Form, Select, Row, Col, DatePicker, message } from 'antd';
import '../styles/ManageEmployee.css';

const { Column } = Table;
const { Search } = Input;

const data = [
  {
    key: '1',
    firstName: 'John',
    lastName: 'Brown',
    age: 32,
    phone: '0987654321',
    roles: ['Intern', 'Developer'],
    hireDate: '23/10/2023',
  },
  {
    key: '2',
    firstName: 'Jim',
    lastName: 'Green',
    age: 42,
    phone: '0987654321',
    roles: ['Tester'],
    hireDate: '23/10/2023',
  },
  {
    key: '3',
    firstName: 'Joe',
    lastName: 'Black',
    age: 32,
    phone: '0987654321',
    roles: ['Middle', 'BA'],
    hireDate: '23/10/2023',
  },
];

const items = [
  {
    key: '1',
    label: (
      <p>
        <EditOutlined />
        Edit
      </p>
    ),
  },
  {
    key: '2',
    label: (
      <p>
        <DeleteOutlined />
        Delete
      </p>
    ),
    danger: true,
  },
];

const handleMenuClick = (e) => {
  message.open({
    type: 'success',
    content: 'Change action successfully, and it will disappear in 03 seconds',
    duration: 3,
  });
  console.log('click', e);
};

const { RangePicker } = DatePicker;

const ManageEmployee = () => {
  const [collapsed, setCollapsed] = useState(false);

  const [selectedAction, setSelectedAction] = useState(null);

  const menuProps = {
    items,
    onClick: (item) => {
      handleMenuClick(item);
      setSelectedAction(item.key);
    },
  };

  const [imageUrl, setImageUrl] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [confirmLoading, setConfirmLoading] = useState(false);

  const showCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleChange = (info) => {
    if (info.file.status === 'done') {
      setImageUrl(URL.createObjectURL(info.file.originFileObj));
    }
  };

  const handleCreateOk = () => {
    console.log('Create OK');
    setConfirmLoading(true);

    setTimeout(() => {
      setCreateModalOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCreateCancel = () => {
    console.log('Create Cancel');
    setCreateModalOpen(false);
  };

  const handleViewOk = () => {
    console.log('View OK');
    setConfirmLoading(true);

    setTimeout(() => {
      setViewModalOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleViewCancel = () => {
    console.log('View Cancel');
    setViewModalOpen(false);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const [formCreate] = Form.useForm();
  const [formView] = Form.useForm();

  return (
    <>
      <Space className="status-filter" direction="horizontal">
        <div>
          <Search
            placeholder="input search text"
            allowClear
            style={{
              width: 304,
            }}
          />
        </div>
        <Button type="primary" onClick={showCreateModal}>
          <PlusOutlined />
          Add Employee
        </Button>
      </Space>
      <Table dataSource={data}>
        <Column title="First Name" dataIndex="firstName" key="firstName" />
        <Column title="Last Name" dataIndex="lastName" key="lastName" />
        <Column title="Age" dataIndex="age" key="age" />
        <Column title="Phone Number" dataIndex="phone" key="phone" />
        <Column
          title="Roles"
          dataIndex="roles"
          key="roles"
          render={(roles) => (
            <>
              {roles.map((role) => (
                <Tag color="green" key={role}>
                  {role}
                </Tag>
              ))}
            </>
          )}
        />
        <Column title="Hire date" dataIndex="hireDate" key="hireDate" />
        <Column
          title="Action"
          key="action"
          render={() => (
            <Dropdown menu={menuProps} placement="bottomLeft">
              <Button>
                <MoreOutlined />
              </Button>
            </Dropdown>
          )}
        />
      </Table>

      <Modal
        title="New Employee"
        visible={createModalOpen}
        onOk={handleCreateOk}
        confirmLoading={confirmLoading}
        onCancel={handleCreateCancel}
        width={1000}
        height={1000}
      >
        <Form form={formCreate} name="createEmployee" layout="vertical" autoComplete="off">
        <Row gutter={16}>
                        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                            <Form.Item name="Name" label="Name" style={{ width: '100%' }}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                            <Form.Item name="Phone" label="Phone" style={{ width: '100%' }}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                            <Form.Item name="Dob" label="Dob" style={{ width: '100%' }}>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                            <Form.Item name="Cid" label="CID" style={{ width: '100%' }}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                            <Form.Item name="Gender" label="Gender" style={{ width: '100%' }}>
                                <Select>
                                    <Select.Option value="male">Male</Select.Option>
                                    <Select.Option value="female">Female</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                            <Form.Item name="Position" label="Position" style={{ width: '100%' }}>
                                <Select>
                                    <Select.Option value="developer">Developer</Select.Option>
                                    <Select.Option value="manager">Manager</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                            <Form.Item name="LineManager" label="LineManager" style={{ width: '100%' }}>
                                <Select>
                                    <Select.Option value="listname">listname</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                            <Form.Item name="IsManager" label="IsManager" style={{ width: '100%' }}>
                                <Radio.Group>
                                    <Radio value={true}>True</Radio>
                                    <Radio value={false}>False</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                            <Form.Item name="Description" label="Description" style={{ width: '100%' }}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                            <Form.Item name="LangFrame" label="Lang And Frame" style={{ width: '100%' }}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                            <Form.Item name="Technology" label="Technology" style={{ width: '100%' }}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                            <Form.Item name="JoinDate" label="JoinDate" style={{ width: '50%' }}>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item name="FireDate" label="FireDate" style={{ width: '50%' }}>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                            <Form.Item label="Avatar" valuePropName="fileList" getValueFromEvent={normFile}>
                                <Upload listType="picture-card" maxCount={1} onChange={handleChange}>
                                    {imageUrl ? (
                                        <img src={imageUrl} alt="avatar" />
                                    ) : (
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
      </Modal>

      <Modal
        title="New"
        visible={viewModalOpen}
        onOk={handleViewOk}
        confirmLoading={confirmLoading}
        onCancel={handleViewCancel}
      >
        <Form form={formView} name="viewProject" layout="vertical" autoComplete="off">
          <Form.Item name="timeLine" label="Timeline">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ManageEmployee;
