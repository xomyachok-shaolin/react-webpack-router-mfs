import React, { lazy, FC } from "react";

// import LoginPage from "@/pages/login";
import LayoutPage from "@/pages/layout";
import WrapperRouteComponent from "./config";
import { useRoutes, RouteObject } from "react-router-dom";

const NotFound = lazy(() => import('@/pages/404'));
const Projects = lazy(() => import('@/pages/projects'));
const Viewer = lazy(() => import('@/pages/viewer'));


const routeList: RouteObject[] = [

  {
    path: "/",
    // @ts-ignore
    element: <WrapperRouteComponent auth={false} >
    <LayoutPage />
    </WrapperRouteComponent>,
    children: [
      // {
      //   path: "login",
      //   element: <LoginPage />,
      // },
      {
        path: "projects",
        // @ts-ignore
        element: <WrapperRouteComponent><Projects /></WrapperRouteComponent>,
      },
      {
        path: "viewer",
        // @ts-ignore
        element: <WrapperRouteComponent><Viewer /></WrapperRouteComponent>,
      },
      {
        path: "*",
        // @ts-ignore
        element: <WrapperRouteComponent><NotFound /></WrapperRouteComponent>,
      },
    ],
  },

];

const RenderRouter: FC = () => {
  const element = useRoutes(routeList);
  return element;
};

export default RenderRouter;