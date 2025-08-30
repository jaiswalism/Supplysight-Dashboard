import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createClient, Provider, cacheExchange, fetchExchange } from 'urql';

const client = createClient({
  url: '/api/',
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>
);