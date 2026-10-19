import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter } from 'react-router-dom';
import { App } from './app/App';
import { ToastProvider } from './components/Toast';
import './style.css';
const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: 0 } } });
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><QueryClientProvider client={client}><HashRouter><ToastProvider><App /></ToastProvider></HashRouter></QueryClientProvider></React.StrictMode>);
