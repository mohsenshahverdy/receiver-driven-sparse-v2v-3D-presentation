import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import './polish.css';

const root = document.getElementById('root');
root.replaceChildren();
createRoot(root).render(<React.StrictMode><App /></React.StrictMode>);
