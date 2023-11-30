import { MoreOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Table, Tag, Dropdown, Button } from 'antd';
import '../styles/ManageEmployee.css'
const { Column } = Table;
const data = [
  {
    key: '1',
    firstName: 'John',
    lastName: 'Brown',
    age: 32,
    phone: '0987654321',
    roles: ['Intern', 'Developer'],
  },
  {
    key: '2',
    firstName: 'Jim',
    lastName: 'Green',
    age: 42,
    phone: '0987654321',
    roles: ['Tester'],
  },
  {
    key: '3',
    firstName: 'Joe',
    lastName: 'Black',
    age: 32,
    phone: '0987654321',
    roles: ['Middle', 'BA'],
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
      <Button><PlusOutlined/>Add Employee</Button>
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
        <Column
          title="Action"
          key="action"
          render={() => (
          <Dropdown
            menu={{
              items,
            }}
            placement="bottomLeft"
          >
            <Button><MoreOutlined/></Button>
          </Dropdown>
          )}
        />
      </Table>
    </>
  )
}

export default ManageEmployee;