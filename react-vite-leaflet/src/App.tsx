import React, { Suspense, useEffect, useMemo } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import { ConfigProvider } from "antd";
import ru_RU from "antd/lib/locale/ru_RU";
import RenderRouter from "./routes";
import SuspendFallbackLoading from "./pages/layout/suspendFallbackLoading";
import axios, { AxiosContext } from "./api/request";

import { createBrowserHistory } from "history";

import "./index.css";
import "./App.less";


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

const history = createBrowserHistory();

const App: React.FC = () => {

  return (

    <AxiosProvider>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          {/* <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div>
          There was an error!{" "}
          <button onClick={() => resetErrorBoundary()}>Try again</button>
          <pre style={{ whiteSpace: "normal" }}>{error.message}</pre>
        </div>
      )}
    > */}
          <Suspense fallback={<SuspendFallbackLoading />}>

            <ConfigProvider locale={ru_RU} componentSize="middle">
              <BrowserRouter>
                <RenderRouter />
              </BrowserRouter>
            </ConfigProvider>
          </Suspense>
          {/* </ErrorBoundary> */}
        </RecoilRoot>
      </QueryClientProvider>
    </AxiosProvider>
  );
};

export default App;
