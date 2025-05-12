import React from "react";
import { Card, Row, Col, Statistic, Typography, Button } from "antd";
import {
  LineChartOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const features = [
    {
      title: "肿瘤发展预测",
      icon: <LineChartOutlined style={{ fontSize: 36, color: "#1890ff" }} />,
      description: "基于医学病例和PET-CT图像的肿瘤发展趋势预测分析",
      link: "/tumor-prediction",
    },
    {
      title: "肿瘤类型分类",
      icon: <AppstoreOutlined style={{ fontSize: 36, color: "#52c41a" }} />,
      description: "利用深度学习技术对肿瘤类型进行智能分类",
      link: "/tumor-classification",
    },
    {
      title: "医疗数据管理",
      icon: <DatabaseOutlined style={{ fontSize: 36, color: "#722ed1" }} />,
      description: "医疗数据的标准化处理和管理系统",
      link: "/data-management",
    },
    {
      title: "数据导出下载",
      icon: <DownloadOutlined style={{ fontSize: 36, color: "#fa8c16" }} />,
      description: "支持多种格式的医疗数据导出和下载功能",
      link: "/data-export",
    },
  ];

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <Title>医疗影像分析系统</Title>
        <Paragraph style={{ fontSize: 16 }}>
          基于人工智能的医学影像分析平台，提供肿瘤预测、分类和医疗数据管理功能
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} md={12} lg={6} key={index}>
            <Card
              hoverable
              style={{ height: "100%" }}
              actions={[
                <Link to={feature.link} key="enter">
                  <Button type="primary">进入功能</Button>
                </Link>,
              ]}
            >
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                {feature.icon}
              </div>
              <Statistic title={feature.title} value=" " />
              <Paragraph>{feature.description}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: 48, textAlign: "center" }}>
        <Paragraph>
          本系统旨在帮助医疗专业人员更高效地分析医学影像数据，提高诊断准确性
        </Paragraph>
      </div>
    </div>
  );
};

export default HomePage;
