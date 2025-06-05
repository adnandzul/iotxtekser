import React from 'react';
import ReactDOM from 'react-dom/client';

// ⬇️ Tambahkan import Bootstrap & Animate.css di sini
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css'; // ✅ Ini dia bro, Animate.css masuk sini

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
