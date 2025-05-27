import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import App from './App.jsx';
import store from './store/index.js';
import './index.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Provider store={store}>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </Provider>
    </Router>
  </StrictMode>
);
