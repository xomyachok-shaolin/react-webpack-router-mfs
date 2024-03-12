import React, { useMemo } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { createRouter } from "./routing/router-factory";
import { RoutingStrategy } from "./routing/types";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { ConfigProvider } from "antd";
import ru_RU from "antd/lib/locale/ru_RU";
import "./index.css";
import "./App.less";
import { RecoilRoot } from "recoil";
import axios, { AxiosContext } from "./api/request";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      suspense: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchInterval: false,
    },
  },
});

const AxiosProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const axiosValue = useMemo(() => {
    return axios;
  }, []);

  return (
    <AxiosContext.Provider value={axiosValue}>{children}</AxiosContext.Provider>
  );
};

const mount = ({
  mountPoint,
  initialPathname,
  routingStrategy,
}: {
  mountPoint: HTMLElement;
  initialPathname?: string;
  routingStrategy?: RoutingStrategy;
}) => {
  const router = createRouter({ strategy: routingStrategy, initialPathname });
  const root = createRoot(mountPoint);
  root.render(<AxiosProvider>
    <QueryClientProvider client={queryClient}>
      <RecoilRoot><ConfigProvider locale={ru_RU} componentSize="middle">
      <RouterProvider router={router} /></ConfigProvider></RecoilRoot></QueryClientProvider></AxiosProvider>);

  return () => queueMicrotask(() => root.unmount());
};

export { mount };
