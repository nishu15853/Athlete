import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router';
import { Agentation } from 'agentation';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
    {import.meta.env.DEV && <Agentation />}
  </React.StrictMode>
);
