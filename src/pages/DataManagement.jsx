import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  DatePicker,
  Typography,
  Tag,
  Card,
  Tabs,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const DataManagement = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      id: "P001",
      name: "张三",
      age: 45,
      gender: "男",
      examDate: "2023-05-15",
      examType: "PET-CT",
      tumorType: "肺腺癌",
      stage: "II期",
      status: "已处理",
    },
    {
      key: "2",
      id: "P002",
      name: "李四",
      age: 62,
      gender: "男",
      examDate: "2023-06-20",
      examType: "MRI",
      tumorType: "肝癌",
      stage: "III期",
      status: "已处理",
    },
    {
      key: "3",
      id: "P003",
      name: "王五",
      age: 38,
      gender: "女",
      examDate: "2023-07-05",
      examType: "PET-CT",
      tumorType: "乳腺癌",
      stage: "I期",
      status: "未处理",
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchColumn, setSearchColumn] = useState("");

  // 处理搜索功能
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  // 获取列搜索组件
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`搜索 ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            重置
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    render: (text) =>
      searchColumn === dataIndex ? (
        <span style={{ backgroundColor: "#ffc069", padding: 0 }}>{text}</span>
      ) : (
        text
      ),
  });

  // 表格列定义
  const columns = [
    {
      title: "病例ID",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id"),
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
      filters: [
        { text: "男", value: "男" },
        { text: "女", value: "女" },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: "检查日期",
      dataIndex: "examDate",
      key: "examDate",
      sorter: (a, b) => new Date(a.examDate) - new Date(b.examDate),
    },
    {
      title: "检查类型",
      dataIndex: "examType",
      key: "examType",
      filters: [
        { text: "PET-CT", value: "PET-CT" },
        { text: "MRI", value: "MRI" },
        { text: "CT", value: "CT" },
      ],
      onFilter: (value, record) => record.examType === value,
    },
    {
      title: "肿瘤类型",
      dataIndex: "tumorType",
      key: "tumorType",
      ...getColumnSearchProps("tumorType"),
    },
    {
      title: "分期",
      dataIndex: "stage",
      key: "stage",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "已处理" ? "green" : "volcano"}>{status}</Tag>
      ),
      filters: [
        { text: "已处理", value: "已处理" },
        { text: "未处理", value: "未处理" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            编辑
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            size="small"
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 处理添加/编辑记录
  const handleAddNew = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "确认删除",
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除 ${record.name} 的记录吗？`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        setDataSource(dataSource.filter((item) => item.key !== record.key));
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingRecord) {
        // 更新现有记录
        setDataSource(
          dataSource.map((item) =>
            item.key === editingRecord.key ? { ...item, ...values } : item
          )
        );
      } else {
        // 添加新记录
        const newRecord = {
          key: `${dataSource.length + 1}`,
          id: `P${String(dataSource.length + 1).padStart(3, "0")}`,
          ...values,
        };
        setDataSource([...dataSource, newRecord]);
      }
      setIsModalVisible(false);
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Title level={2}>医疗数据管理</Title>
      <Paragraph>
        对医疗数据进行标准化处理和管理，支持数据的增加、修改、删除和查询功能。
      </Paragraph>

      <Tabs defaultActiveKey="1">
        <TabPane tab="病例数据" key="1">
          <Card>
            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddNew}
              >
                添加新病例
              </Button>
            </div>

            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={{ pageSize: 10 }}
              bordered
              scroll={{ x: "max-content" }}
            />
          </Card>
        </TabPane>

        <TabPane tab="影像数据" key="2">
          <Card>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <Title level={4}>影像数据管理功能正在开发中</Title>
              <Paragraph>此模块将支持医学影像的上传、标注和管理功能</Paragraph>
            </div>
          </Card>
        </TabPane>
      </Tabs>

      {/* 添加/编辑记录的模态框 */}
      <Modal
        title={editingRecord ? "编辑病例" : "添加新病例"}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="age"
            label="年龄"
            rules={[{ required: true, message: "请输入年龄" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="性别"
            rules={[{ required: true, message: "请选择性别" }]}
          >
            <Select>
              <Select.Option value="男">男</Select.Option>
              <Select.Option value="女">女</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="examDate"
            label="检查日期"
            rules={[{ required: true, message: "请选择检查日期" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="examType"
            label="检查类型"
            rules={[{ required: true, message: "请选择检查类型" }]}
          >
            <Select>
              <Select.Option value="PET-CT">PET-CT</Select.Option>
              <Select.Option value="MRI">MRI</Select.Option>
              <Select.Option value="CT">CT</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="tumorType"
            label="肿瘤类型"
            rules={[{ required: true, message: "请输入肿瘤类型" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="stage" label="分期">
            <Select>
              <Select.Option value="I期">I期</Select.Option>
              <Select.Option value="II期">II期</Select.Option>
              <Select.Option value="III期">III期</Select.Option>
              <Select.Option value="IV期">IV期</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: "请选择状态" }]}
          >
            <Select>
              <Select.Option value="已处理">已处理</Select.Option>
              <Select.Option value="未处理">未处理</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataManagement;
