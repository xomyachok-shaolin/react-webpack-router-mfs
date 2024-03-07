import React from 'react';
import { Outlet } from "react-router-dom";
import { NavigationManager } from "../components/NavigationManager";
// import { Page1 } from "../pages/Page1";
// import { Page2 } from "../pages/Page2";

import LoginPage from "../pages/login";

export const routes = [
  {
    path: "/",
    element: (
      <NavigationManager>
        <Outlet />
      </NavigationManager>
    ),
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      // {
      //   path: "page-2",
      //   element: <Page2 />,
      // },
    ],
  },
];
