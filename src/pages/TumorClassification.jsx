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
  Progress,
  Tag,
  Image,
} from "antd";
import { InboxOutlined, AppstoreOutlined } from "@ant-design/icons";

const { Dragger } = Upload;
const { Title, Paragraph } = Typography;

const TumorClassification = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [classificationResult, setClassificationResult] = useState(null);

  const handleUpload = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (info.file.status === "done") {
      // 获取上传的图像并显示
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);

        // 模拟分类过程
        setTimeout(() => {
          setClassificationResult({
            primaryType: "腺癌",
            confidence: 87,
            possibleTypes: [
              { name: "腺癌", probability: 87 },
              { name: "鳞状细胞癌", probability: 8 },
              { name: "小细胞癌", probability: 3 },
              { name: "大细胞癌", probability: 2 },
            ],
            malignancyLevel: "中度恶性",
            characteristics: ["边缘不规则", "密度不均匀", "有钙化点"],
          });
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

  // 根据概率值获取对应的颜色
  const getProbabilityColor = (probability) => {
    if (probability > 70) return "#52c41a";
    if (probability > 30) return "#faad14";
    return "#999999";
  };

  return (
    <div>
      <Title level={2}>肿瘤类型分类</Title>
      <Paragraph>
        上传肿瘤医学影像，利用深度学习技术对肿瘤类型进行智能分类和特征分析。
      </Paragraph>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="上传肿瘤影像" bordered={false}>
            {!imageUrl && (
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">
                  支持单个上传，仅支持医学影像格式
                </p>
              </Dragger>
            )}

            {imageUrl && (
              <div style={{ textAlign: "center" }}>
                <Image
                  src={imageUrl}
                  alt="肿瘤影像"
                  style={{ maxWidth: "100%" }}
                />
                <Button
                  type="primary"
                  onClick={() => {
                    setImageUrl(null);
                    setClassificationResult(null);
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
          <Card title="分类结果" bordered={false}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <Spin size="large" />
                <p style={{ marginTop: 16 }}>正在分析图像并进行分类...</p>
              </div>
            ) : classificationResult ? (
              <div>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <Title level={3}>{classificationResult.primaryType}</Title>
                  <Progress
                    type="circle"
                    percent={classificationResult.confidence}
                    format={(percent) => `${percent}% 置信度`}
                    width={120}
                  />
                  <div style={{ marginTop: 16 }}>
                    <Tag color="blue">
                      {classificationResult.malignancyLevel}
                    </Tag>
                  </div>
                </div>

                <Divider>可能的类型</Divider>
                {classificationResult.possibleTypes.map((type, index) => (
                  <div key={index} style={{ marginBottom: 10 }}>
                    <Row align="middle">
                      <Col span={8}>{type.name}</Col>
                      <Col span={16}>
                        <Progress
                          percent={type.probability}
                          size="small"
                          strokeColor={getProbabilityColor(type.probability)}
                        />
                      </Col>
                    </Row>
                  </div>
                ))}

                <Divider>肿瘤特征</Divider>
                <div>
                  {classificationResult.characteristics.map((char, index) => (
                    <Tag
                      key={index}
                      color="purple"
                      style={{ margin: "0 8px 8px 0" }}
                    >
                      {char}
                    </Tag>
                  ))}
                </div>

                <Divider>建议</Divider>
                <Paragraph>
                  根据分类结果，建议进一步进行病理学检查以确认诊断。该类型肿瘤通常需要综合治疗方案。
                </Paragraph>
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "30px 0",
                  color: "#999",
                }}
              >
                <p>请先上传肿瘤影像以获取分类结果</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TumorClassification;
