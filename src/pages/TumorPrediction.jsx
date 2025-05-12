import React, { useState } from "react";
import {
  Upload,
  Button,
  Card,
  Row,
  Col,
  Spin,
  Typography,
  Divider,
  Steps,
  Image,
  Table,
  Modal,
} from "antd";
import {
  InboxOutlined,
  LineChartOutlined,
  SelectOutlined,
} from "@ant-design/icons";

const { Dragger } = Upload;
const { Title, Paragraph } = Typography;

const TumorPrediction = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  // 模拟的病例数据
  const caseData = [
    {
      key: "1",
      id: "P001",
      name: "张三",
      age: 45,
      gender: "男",
      examDate: "2023-05-15",
      examType: "PET-CT",
      tumorType: "肺腺癌",
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
    },
  ];

  // 病例选择表格的列定义
  const columns = [
    {
      title: "病例ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "检查日期",
      dataIndex: "examDate",
      key: "examDate",
    },
    {
      title: "检查类型",
      dataIndex: "examType",
      key: "examType",
    },
    {
      title: "肿瘤类型",
      dataIndex: "tumorType",
      key: "tumorType",
    },
  ];

  const handleCaseSelect = (record) => {
    setSelectedCase(record);
    setIsModalVisible(false);
    // 模拟加载选中病例的图像
    setLoading(true);
    setTimeout(() => {
      setImageUrl("https://example.com/sample-image.jpg");
      setLoading(false);
      setCurrentStep(2);
    }, 1000);
  };

  const handleUpload = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      setCurrentStep(1);
      return;
    }

    if (info.file.status === "done") {
      // 获取上传的图像并显示
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
        setCurrentStep(2);

        // 模拟预测过程
        setTimeout(() => {
          setPredictionResult({
            growthRate: "5.2mm/年",
            riskLevel: "中等风险",
            predictionChart:
              "https://gw.alipayobjects.com/zos/rmsportal/NeUTMwKtPcPxIFNTWZOZ.png", // 示例图表URL
            recommendations: [
              "建议每3个月进行一次复查",
              "密切监测肿瘤大小变化",
              "考虑辅助治疗方案",
            ],
          });
          setCurrentStep(3);
        }, 2000);
      });
    }
  };

  // 将文件转换为Base64以便预览
  const getBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(file);
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76", // 这里应替换为实际的上传API
    onChange: handleUpload,
    accept: "image/*",
    showUploadList: false,
  };

  const steps = [
    {
      title: "上传图像",
      description: "上传PET-CT图像",
    },
    {
      title: "处理中",
      description: "分析图像数据",
    },
    {
      title: "生成预测",
      description: "计算发展趋势",
    },
    {
      title: "完成",
      description: "显示预测结果",
    },
  ];

  return (
    <div>
      <Title level={2}>肿瘤发展预测</Title>
      <Paragraph>
        从病例库选择包含完整多模态数据的病例，预测肿瘤的发展趋势和风险评估。
      </Paragraph>

      <Button
        type="primary"
        icon={<SelectOutlined />}
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 20 }}
      >
        从病例库选择
      </Button>

      <Modal
        title="选择病例"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={1000}
      >
        <Table
          columns={columns}
          dataSource={caseData}
          onRow={(record) => ({
            onClick: () => handleCaseSelect(record),
          })}
          style={{ cursor: "pointer" }}
        />
      </Modal>

      <Steps current={currentStep} style={{ marginBottom: 30 }}>
        {steps.map((item) => (
          <Steps.Step
            key={item.title}
            title={item.title}
            description={item.description}
          />
        ))}
      </Steps>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="病例影像" bordered={false}>
            {imageUrl && (
              <div style={{ textAlign: "center" }}>
                <Image
                  src={imageUrl}
                  alt="肿瘤影像"
                  style={{ maxWidth: "100%" }}
                />
                <div style={{ marginTop: 16 }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      setImageUrl(null);
                      setPredictionResult(null);
                      setCurrentStep(0);
                    }}
                    style={{ marginRight: 8 }}
                  >
                    重新上传
                  </Button>
                  {selectedCase && (
                    <Button
                      type="default"
                      icon={<SelectOutlined />}
                      onClick={() => {
                        setSelectedCase(null);
                        setImageUrl(null);
                        setPredictionResult(null);
                        setCurrentStep(0);
                        setIsModalVisible(true);
                      }}
                    >
                      重新选择病例
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="预测结果" bordered={false}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <Spin size="large" />
                <p style={{ marginTop: 16 }}>正在分析图像并生成预测结果...</p>
              </div>
            ) : predictionResult ? (
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card size="small" title="预计生长速率">
                      <div
                        style={{
                          textAlign: "center",
                          fontSize: 24,
                          fontWeight: "bold",
                          color: "#1890ff",
                        }}
                      >
                        {predictionResult.growthRate}
                      </div>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" title="风险等级">
                      <div
                        style={{
                          textAlign: "center",
                          fontSize: 24,
                          fontWeight: "bold",
                          color: "#faad14",
                        }}
                      >
                        {predictionResult.riskLevel}
                      </div>
                    </Card>
                  </Col>
                </Row>

                <Divider>发展趋势图</Divider>
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <LineChartOutlined
                    style={{ fontSize: 48, color: "#1890ff" }}
                  />
                  <p>肿瘤大小随时间变化趋势</p>
                </div>

                <Divider>医生建议</Divider>
                <ul>
                  {predictionResult.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "30px 0",
                  color: "#999",
                }}
              >
                <p>请先上传PET-CT图像以获取预测结果</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TumorPrediction;
