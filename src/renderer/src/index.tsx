// src/index.tsx
//import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './AppRouterProvider';
import './i18n/config'; // 国際化,多言語化

import { DebugProvider } from './globalContexts/DebugContext'; // for virtual camera (delete)
import { DebugProviderDrawer } from './globalContexts/DebugDrawerContext'; // for drawer (delete)
import { ProviderAuth } from './globalContexts/AuthContext' // for login Authentication
import { ProviderDrawerOpen } from './globalContexts/DrawerContext'; // for left drawer
import { HelmetProvider } from 'react-helmet-async'; // for changing app title
import { RamPercentDisplayProvider } from './globalContexts/RamPercentContext';
import { DeviceProvider } from './globalContexts/DeviceContext';
import { MessagesProvider } from './globalContexts/MessagesContext';
import { SoloSubscribeEventProvider } from './globalContexts/SoloSubscribeEventContext';
import { NotificationProvider } from './globalContexts/NotificationContext';
import { AppThemeProvider } from './globalContexts/AppThemeContext';
import { QuartetSubscribeEventProvider } from './globalContexts/QuartetSubscribeEventContext';
import { QuartetSubscribeMessageProvider } from './globalContexts/QuartetSubscribeMessageContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CalibrationModeProvider } from './globalContexts/CalibrationTypeContext';

export const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  //<React.StrictMode>
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ProviderAuth> {/* login Authentication */}
        <DebugProvider> {/* virtual camera (仮想カメラ数入力機能) : 削除予定 */}
          <DebugProviderDrawer> {/* drawer (初期メニュー項目表示機能) : 削除予定 */}
            <RamPercentDisplayProvider>
              <AppThemeProvider> {/* dark mode  */}
                <ProviderDrawerOpen> {/* open left drawer  */}
                  <MessagesProvider>
                    <NotificationProvider>
                      <CalibrationModeProvider>
                        <QuartetSubscribeMessageProvider>
                          <QuartetSubscribeEventProvider>
                            <DeviceProvider> {/* camera sigurls */}
                              <SoloSubscribeEventProvider>
                                <App />
                              </SoloSubscribeEventProvider>
                            </DeviceProvider>
                          </QuartetSubscribeEventProvider>
                        </QuartetSubscribeMessageProvider>
                      </CalibrationModeProvider>
                    </NotificationProvider>
                  </MessagesProvider>
                </ProviderDrawerOpen>
              </AppThemeProvider>
            </RamPercentDisplayProvider>
          </DebugProviderDrawer>
        </DebugProvider>
      </ProviderAuth>
    </QueryClientProvider>
  </HelmetProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
