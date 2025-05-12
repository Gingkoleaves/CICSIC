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
  Upload,
  message,
  Divider,
  Progress,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  InboxOutlined,
  FileTextOutlined,
  FileImageOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Dragger } = Upload;

const DataManagement = () => {
  const [form] = Form.useForm();
  const [uploadForm] = Form.useForm();
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState({
    case: [],
    text: [],
    image: [],
  });
  const [uploadProgress, setUploadProgress] = useState({
    case: 0,
    text: 0,
    image: 0,
  });
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

  // 处理文件上传
  const handleFileUpload = (info, type) => {
    const { fileList } = info;
    setUploadingFiles((prev) => ({
      ...prev,
      [type]: fileList,
    }));

    // 模拟上传进度
    if (fileList.length > 0) {
      let progress = 0;
      const timer = setInterval(() => {
        progress += 10;
        if (progress > 100) {
          clearInterval(timer);
          message.success(
            `${
              type === "case" ? "病例" : type === "text" ? "文本" : "影像"
            }数据上传完成`
          );
          setUploadProgress((prev) => ({
            ...prev,
            [type]: 0,
          }));
          return;
        }
        setUploadProgress((prev) => ({
          ...prev,
          [type]: progress,
        }));
      }, 300);
    }
  };

  // 处理批量上传
  const handleBatchUpload = () => {
    setUploadModalVisible(true);
  };

  const handleUploadModalOk = () => {
    uploadForm.validateFields().then((values) => {
      // 这里可以处理上传逻辑
      message.success("数据上传成功");
      setUploadModalVisible(false);
      uploadForm.resetFields();
      setUploadingFiles({
        case: [],
        text: [],
        image: [],
      });
    });
  };

  return (
    <div>
      <Title level={2}>医疗数据管理</Title>
      <Paragraph>
        对医疗数据进行标准化处理和管理，支持数据的增加、修改、删除和查询功能。
      </Paragraph>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Button icon={<UploadOutlined />} onClick={handleBatchUpload}>
            批量导入数据
          </Button>
        </div>
        <div
          style={{
            padding: "12px 24px",
            background: "#fffbe6",
            border: "1px solid #ffe58f",
            borderRadius: "4px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <ExclamationCircleOutlined
            style={{ color: "#faad14", fontSize: "16px" }}
          />
          <span>
            注意相同病人的病例数据、文本数据、影像数据应当具有相同的文件名，方便匹配
          </span>
        </div>

        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: "max-content" }}
        />
      </Card>

      {/* 批量上传模态框 */}
      <Modal
        title="批量导入数据"
        visible={uploadModalVisible}
        onOk={handleUploadModalOk}
        onCancel={() => {
          setUploadModalVisible(false);
          uploadForm.resetFields();
          setUploadingFiles({
            case: [],
            text: [],
            image: [],
          });
        }}
        width={800}
        okText="开始上传"
        cancelText="取消"
      >
        <Form form={uploadForm} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="病例数据" size="small">
                <Upload
                  multiple
                  accept=".xlsx,.csv"
                  fileList={uploadingFiles.case}
                  onChange={(info) => handleFileUpload(info, "case")}
                  beforeUpload={() => false}
                >
                  <Button icon={<FileDoneOutlined />}>选择病例文件</Button>
                </Upload>
                {uploadProgress.case > 0 && (
                  <Progress
                    percent={uploadProgress.case}
                    size="small"
                    style={{ marginTop: 8 }}
                  />
                )}
              </Card>
            </Col>
            <Col span={24}>
              <Card title="文本数据" size="small">
                <Upload
                  multiple
                  accept=".txt,.csv,.xlsx"
                  fileList={uploadingFiles.text}
                  onChange={(info) => handleFileUpload(info, "text")}
                  beforeUpload={() => false}
                >
                  <Button icon={<FileTextOutlined />}>选择文本文件</Button>
                </Upload>
                {uploadProgress.text > 0 && (
                  <Progress
                    percent={uploadProgress.text}
                    size="small"
                    style={{ marginTop: 8 }}
                  />
                )}
              </Card>
            </Col>
            <Col span={24}>
              <Card title="影像数据" size="small">
                <Upload
                  multiple
                  accept=".dcm"
                  fileList={uploadingFiles.image}
                  onChange={(info) => handleFileUpload(info, "image")}
                  beforeUpload={() => false}
                >
                  <Button icon={<FileImageOutlined />}>选择影像文件</Button>
                </Upload>
                {uploadProgress.image > 0 && (
                  <Progress
                    percent={uploadProgress.image}
                    size="small"
                    style={{ marginTop: 8 }}
                  />
                )}
              </Card>
            </Col>
          </Row>
        </Form>
      </Modal>

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
