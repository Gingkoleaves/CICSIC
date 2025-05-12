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
} from "antd";
import { InboxOutlined, LineChartOutlined } from "@ant-design/icons";

const { Dragger } = Upload;
const { Title, Paragraph } = Typography;

const TumorPrediction = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

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
        通过上传PET-CT图像，结合病例数据，预测肿瘤的发展趋势和风险评估。
      </Paragraph>

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
          <Card title="上传PET-CT图像" bordered={false}>
            {!imageUrl && (
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">
                  支持单个或批量上传，仅支持PET-CT图像格式
                </p>
              </Dragger>
            )}

            {imageUrl && (
              <div style={{ textAlign: "center" }}>
                <Image
                  src={imageUrl}
                  alt="PET-CT图像"
                  style={{ maxWidth: "100%" }}
                />
                <Button
                  type="primary"
                  onClick={() => {
                    setImageUrl(null);
                    setPredictionResult(null);
                    setCurrentStep(0);
                  }}
                  style={{ marginTop: 16 }}
                >
                  重新上传
                </Button>
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
