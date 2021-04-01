import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// React Query for managing data requests 
import { QueryClient, QueryClientProvider } from 'react-query'; 

const client = new QueryClient();

ReactDOM.render(
  <QueryClientProvider client={client} >
    <App />
  </QueryClientProvider>
, document.getElementById('root'));

