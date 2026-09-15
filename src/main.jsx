import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { CRMProvider } from './context/CRMContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <CRMProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CRMProvider>
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);
