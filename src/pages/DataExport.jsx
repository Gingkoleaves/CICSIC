import React, { useState } from "react";
import {
  Card,
  Button,
  Table,
  Select,
  DatePicker,
  Form,
  Checkbox,
  Radio,
  Typography,
  Space,
  message,
  Divider,
  Row,
  Col,
  Tag,
} from "antd";
import {
  DownloadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { saveAs } from "file-saver";

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const DataExport = () => {
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  // 模拟数据
  const dataSource = [
    {
      key: "1",
      id: "P001",
      name: "张三",
      examDate: "2023-05-15",
      examType: "PET-CT",
      tumorType: "肺腺癌",
      dataSize: "256MB",
      hasImage: true,
      hasReport: true,
    },
    {
      key: "2",
      id: "P002",
      name: "李四",
      examDate: "2023-06-20",
      examType: "MRI",
      tumorType: "肝癌",
      dataSize: "189MB",
      hasImage: true,
      hasReport: true,
    },
    {
      key: "3",
      id: "P003",
      name: "王五",
      examDate: "2023-07-05",
      examType: "PET-CT",
      tumorType: "乳腺癌",
      dataSize: "312MB",
      hasImage: true,
      hasReport: false,
    },
    {
      key: "4",
      id: "P004",
      name: "赵六",
      examDate: "2023-08-12",
      examType: "CT",
      tumorType: "结直肠癌",
      dataSize: "145MB",
      hasImage: true,
      hasReport: true,
    },
    {
      key: "5",
      id: "P005",
      name: "钱七",
      examDate: "2023-09-03",
      examType: "PET-CT",
      tumorType: "胰腺癌",
      dataSize: "278MB",
      hasImage: true,
      hasReport: true,
    },
  ];

  // 表格列定义
  const columns = [
    {
      title: "病例ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "患者姓名",
      dataIndex: "name",
      key: "name",
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
    },
    {
      title: "数据大小",
      dataIndex: "dataSize",
      key: "dataSize",
    },
    {
      title: "包含内容",
      key: "content",
      render: (_, record) => (
        <span>
          {record.hasImage && <Tag color="blue">影像</Tag>}
          {record.hasReport && <Tag color="green">报告</Tag>}
        </span>
      ),
    },
  ];

  // 处理行选择
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 处理导出
  const handleExport = (values) => {
    if (selectedRowKeys.length === 0) {
      message.warning("请至少选择一条记录进行导出");
      return;
    }

    setLoading(true);

    // 模拟导出过程
    setTimeout(() => {
      const format = values.format;
      const fileName = `医疗数据导出_${new Date().toISOString().split("T")[0]}`;
      let fileExtension = "";

      switch (format) {
        case "excel":
          fileExtension = ".xlsx";
          break;
        case "csv":
          fileExtension = ".csv";
          break;
        case "pdf":
          fileExtension = ".pdf";
          break;
        default:
          fileExtension = ".zip";
      }

      // 这里应该是实际的导出逻辑，现在只是模拟
      // 在实际应用中，这里应该调用后端API进行数据导出
      message.success(
        `已成功导出 ${selectedRowKeys.length} 条记录为 ${fileName}${fileExtension}`
      );

      // 模拟文件下载
      // 在实际应用中，这里应该处理从后端返回的文件流
      const blob = new Blob(["模拟的导出数据内容"], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, `${fileName}${fileExtension}`);

      setLoading(false);
    }, 2000);
  };

  // 获取导出格式图标
  const getFormatIcon = (format) => {
    switch (format) {
      case "excel":
        return <FileExcelOutlined style={{ color: "#217346" }} />;
      case "csv":
        return <FileTextOutlined style={{ color: "#1890ff" }} />;
      case "pdf":
        return <FilePdfOutlined style={{ color: "#ff4d4f" }} />;
      default:
        return <DownloadOutlined />;
    }
  };

  return (
    <div>
      <Title level={2}>数据导出下载</Title>
      <Paragraph>
        选择需要导出的医疗数据记录，并指定导出格式和内容选项。
      </Paragraph>

      <Card title="导出选项" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleExport}
          initialValues={{
            format: "excel",
            content: ["basic", "image", "report"],
            anonymize: false,
          }}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item name="dateRange" label="日期范围">
                <RangePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="examType" label="检查类型">
                <Select mode="multiple" placeholder="选择检查类型" allowClear>
                  <Option value="PET-CT">PET-CT</Option>
                  <Option value="MRI">MRI</Option>
                  <Option value="CT">CT</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="tumorType" label="肿瘤类型">
                <Select mode="multiple" placeholder="选择肿瘤类型" allowClear>
                  <Option value="肺腺癌">肺腺癌</Option>
                  <Option value="肝癌">肝癌</Option>
                  <Option value="乳腺癌">乳腺癌</Option>
                  <Option value="结直肠癌">结直肠癌</Option>
                  <Option value="胰腺癌">胰腺癌</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">导出设置</Divider>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="format"
                label="导出格式"
                rules={[{ required: true, message: "请选择导出格式" }]}
              >
                <Radio.Group>
                  <Space direction="vertical">
                    <Radio value="excel">
                      <Space>
                        <FileExcelOutlined style={{ color: "#217346" }} />
                        Excel格式 (.xlsx)
                      </Space>
                    </Radio>
                    <Radio value="csv">
                      <Space>
                        <FileTextOutlined style={{ color: "#1890ff" }} />
                        CSV格式 (.csv)
                      </Space>
                    </Radio>
                    <Radio value="pdf">
                      <Space>
                        <FilePdfOutlined style={{ color: "#ff4d4f" }} />
                        PDF格式 (.pdf)
                      </Space>
                    </Radio>
                    <Radio value="dicom">
                      <Space>
                        <DownloadOutlined />
                        DICOM格式 (医学影像)
                      </Space>
                    </Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="content"
                label="导出内容"
                rules={[{ required: true, message: "请选择导出内容" }]}
              >
                <Checkbox.Group>
                  <Space direction="vertical">
                    <Checkbox value="basic">基本病例信息</Checkbox>
                    <Checkbox value="image">医学影像数据</Checkbox>
                    <Checkbox value="report">诊断报告</Checkbox>
                    <Checkbox value="analysis">分析结果</Checkbox>
                  </Space>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item name="anonymize" valuePropName="checked">
                <Checkbox>匿名化处理（移除个人识别信息）</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<DownloadOutlined />}
              loading={loading}
            >
              导出选中数据
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title={`可导出数据 (已选择 ${selectedRowKeys.length} 项)`}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          pagination={{ pageSize: 10 }}
          bordered
        />
      </Card>
    </div>
  );
};

export default DataExport;
