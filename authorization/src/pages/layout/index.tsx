import React, { FC, useEffect, Suspense, useCallback, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { MenuList, MenuChild } from "@/models/menu.interface";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { userState } from "@/stores/user";
import { useRecoilState } from "recoil";

import type { MenuDataItem } from "@ant-design/pro-layout";
import ProLayout from "@ant-design/pro-layout";
import {
  SmileOutlined, HeartOutlined,
  FrownOutlined, GlobalOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import RightContent from "./components/RightContent";// @ts-ignore
// import LogoIcon from "@/assets/logo/rosatom1.svg?react";
import Footer from "./components/Footer";
import { Breadcrumb, Tooltip } from "antd";

const history = createBrowserHistory();

const IconMap: { [key: string]: React.ReactNode } = {
  smile: <SmileOutlined />,
  heart: <HeartOutlined />,
  frown: <FrownOutlined />,
  earth: <GlobalOutlined />,
};

const LayoutPage: FC = ({ }) => {
  // const { data: menuList, error } = useGetCurrentMenus();

  const menuList = [
    {
      path: '/projects',
      name: 'Проекты',
      icon: 'smile',
    },
    {
      path: '/viewer',
      name: 'Обозреватель',
      icon: 'earth',
    },
    {
      path: '/404',
      name: '404',
      icon: 'frown',
    }
  ]

  const [user, setUser] = useRecoilState(userState);
  const { device, collapsed, newUser, settings } = user;
  const isMobile = device === "MOBILE";
  // const { driverStart } = useGuide();
  const location = useLocation();
  const navigate = useNavigate();
  const pathSnippets = location.pathname.split('/').filter(i => i);
  

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [navigate, location]);

  const toggle = () => {
    setUser({ ...user, collapsed: !collapsed });
  };

  const initMenuListAll = (menu: MenuList) => {
    const MenuListAll: MenuChild[] = [];
    menu.forEach((m) => {
      if (!m?.children?.length) {
        MenuListAll.push(m);
      } else {
        m?.children.forEach((mu) => {
          MenuListAll.push(mu);
        });
      }
    });
    return MenuListAll;
  };

  const menuDataRender = () => {
    const flattenedMenu = [];

    for (const menuItem of menuList) {
      // Add the top-level menu item
      flattenedMenu.push({
        ...menuItem,
        icon: menuItem.icon && IconMap[menuItem.icon],
      });
      // @ts-ignore
      if (menuItem.children && menuItem.children.length > 0) {
        // Handle submenus
        // @ts-ignore
        for (const subMenuItem of menuItem.children) {
          flattenedMenu.push({
            ...subMenuItem,
            icon: subMenuItem.icon && IconMap[subMenuItem.icon],
          });
        }
      }
    }

    return flattenedMenu;
  };

  function normalizePath(path) {
    // Remove trailing slash for non-root paths
    return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  }
  

  return (
    <ProLayout
      style={{ minHeight: 'auto' }}
      collapsed={undefined}
      location={{
        pathname: normalizePath(location.pathname),
      }}
      {...settings}
      onCollapse={undefined}
      headerTitleRender={() => <></>}
      menuHeaderRender={(logo, title, props) => (
        <div style={{ display: "flex", alignItems: 'center', height: '100%' }}>
          <img src="" alt="" />
          <Breadcrumb style={{ marginLeft: 10 }}>
            {pathSnippets.length > 0 && (
              <Breadcrumb.Item style={{ listStyleType: 'none' }}>
                <Link style={{ fontWeight: 'bold', fontSize: "110%" }} to={`/${pathSnippets[0]}`}>
                  Проекты
                </Link>
              </Breadcrumb.Item>
            )}
            {pathSnippets.length > 1 && (
              <Breadcrumb.Item style={{ whiteSpace: "nowrap" }}>
                <Tooltip title="123">
                  {/* Content for the second breadcrumb item */}
                </Tooltip>
              </Breadcrumb.Item>
            )}
          </Breadcrumb>
        </div>
      )}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (
          menuItemProps.isUrl ||
          !menuItemProps.path ||
          location.pathname === menuItemProps.path
        ) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [    {
        path: "/",
        breadcrumbName: "Главная",
      },
        ...routers,
      ]}
      menuDataRender={menuDataRender}
      rightContentRender={() => <RightContent />}
      footerRender={() => <Footer />}
    // logo={<LogoIcon width={90} height={45} />}
    >
      <Outlet />
    </ProLayout>
  );
};

export default LayoutPage;
