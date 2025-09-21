import React from 'react';
import { createRoot } from 'react-dom/client';
import ThemedApp from './ThemedApp';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ThemedApp />
  </React.StrictMode>
);
