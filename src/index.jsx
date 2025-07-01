import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/tailwind.css';
import './styles/index.css';
import { suppressResizeObserverErrors } from './utils/resizeObserverFix';

// Apply ResizeObserver error suppression globally
suppressResizeObserverErrors();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);