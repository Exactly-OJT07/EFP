import { MoreOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Space, Table, Tag, Dropdown, Button, Input } from 'antd';
import '../styles/ManageEmployee.css'
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
      <p><EditOutlined/>Edit</p>
    ),
  },
  {
    key: '2',
    label: (
      <p><DeleteOutlined/>Delete</p>
    ),
    danger: true,
  },
];


function ManageEmployee() {
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
      <Button type="primary"><PlusOutlined/>Add Employee</Button>
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
        <Column title="Hire date" dataIndex="hireDate" key="hireDate"/>
        <Column
          title="Action"
          key="action"
          render={() => (
          <Dropdown
            menu={{
              items,
            }}
            trigger={['click']}
            placement="bottomLeft"
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <MoreOutlined/>
              </Space>
            </a>
          </Dropdown>
          )}
        />
      </Table>
    </>
  )
}

export default ManageEmployee;