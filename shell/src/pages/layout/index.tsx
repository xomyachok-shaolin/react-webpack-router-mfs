import React, { FC, useEffect, Suspense, useCallback, useState } from "react";
// import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
// import { MenuList, MenuChild } from "@/models/menu.interface";
import { Outlet  } from "react-router-dom";
// import { userState } from "@/stores/user";
// import { useRecoilState } from "recoil";



const LayoutPage: FC = ({ }) => {
  // const { data: menuList, error } = useGetCurrentMenus();

  return (
      <Outlet />
  );
};

export default LayoutPage;
