import React from "react";
import { Layout, Menu, Typography } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LineChartOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  DownloadOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

const MainLayout = () => {
  const location = useLocation();
  const selectedKey = location.pathname;

  const menuItems = [
    {
      key: "/",
      icon: <MedicineBoxOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: "/tumor-prediction",
      icon: <LineChartOutlined />,
      label: <Link to="/tumor-prediction">肿瘤发展预测</Link>,
    },
    {
      key: "/tumor-classification",
      icon: <AppstoreOutlined />,
      label: <Link to="/tumor-classification">肿瘤类型分类</Link>,
    },
    {
      key: "/data-management",
      icon: <DatabaseOutlined />,
      label: <Link to="/data-management">医疗数据管理</Link>,
    },
    {
      key: "/data-export",
      icon: <DownloadOutlined />,
      label: <Link to="/data-export">数据导出下载</Link>,
    },
  ];

  return (
    <Layout
      style={{
        minHeight: "100px",
        background: "white",
        position: "fixed",
        padding: "0px 36px 0px 12px",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Sider width={240} theme="light" style={{ padding: "0px 12px 0px 0px" }}>
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
            医疗影像分析系统
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ height: "100%", borderRight: 0 }}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "white", padding: "24px 24px" }}>
          <Title level={3} style={{ margin: 0 }}>
            {menuItems.find((item) => item.key === selectedKey)?.label.props
              .children || "医疗影像分析系统"}
          </Title>
        </Header>
        <Content
          style={{
            background: "white",
            minHeight: 280,
            overflow: "auto",
            height: "calc(100vh - 64px - 69px)",
            padding: "24px",
          }}
        >
          <Outlet
            style={{
              width: "100%",
            }}
          />
        </Content>
        <Footer
          style={{
            textAlign: "center",
            padding: "16px 24px",
            background: "white",
          }}
        >
          医疗影像分析系统 ©{new Date().getFullYear()} 同济大学
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
