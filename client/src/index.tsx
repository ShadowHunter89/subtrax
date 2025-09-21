import React from 'react';
import { createRoot } from 'react-dom/client';
import ThemeApp from './ThemeApp';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
  <ThemeApp />
  </React.StrictMode>
);
