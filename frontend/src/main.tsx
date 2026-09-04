import "./index.css";
import "./i18";
import "./telegramDemo";

import {QueryClientProvider} from "@tanstack/react-query";
import {SDKProvider} from "@telegram-apps/sdk-react";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";

import CloudStorageProvider from "@/core/providers/CloudStorageProvider";

import {queryClient} from "./api/queryClient";
import App from "./App";
import {ErrorBoundary} from "./core/ErrorBoundary";
import AuthProvider from "./core/providers/AuthProvider";
import HideHeaderProvider from "./core/providers/HideHeaderProvider";
import {SystemMessageProvider} from "./core/providers/SystemMessageProvider";
import ThemeProvider from "./core/providers/ThemeProvider";
import TimerProvider from "./core/providers/TimerProvider";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <BrowserRouter>
      <SDKProvider acceptCustomStyles>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <CloudStorageProvider>
              <AuthProvider>
                <SystemMessageProvider>
                  <TimerProvider>
                    <HideHeaderProvider>
                      <App />
                    </HideHeaderProvider>
                  </TimerProvider>
                </SystemMessageProvider>
              </AuthProvider>
            </CloudStorageProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SDKProvider>
    </BrowserRouter>
  </ErrorBoundary>,
);
