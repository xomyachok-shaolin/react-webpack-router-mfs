import React, { lazy } from 'react';
import { Outlet } from "react-router-dom";
import { NavigationManager } from "../components/NavigationManager";
// import { Page1 } from "../pages/Page1";
// import { Page2 } from "../pages/Page2";

// import LoginPage from "../pages/login";

const Projects = lazy(() => import('@/pages/projects'));
const ProjectDetail = lazy(() => import('@/pages/projects/ProjectDetail'));
const Viewer = lazy(() => import('@/pages/viewer'));

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
        element: <Projects />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "projects/:id", 
        element: <ProjectDetail />,
      },
      {
        path: "viewer",
        element: <Viewer />,
      },
    ],
  },
];
