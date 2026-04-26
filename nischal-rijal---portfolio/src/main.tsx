/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Fix for environments where some libraries try to overwrite window.fetch
// Most of the logic is now in index.html, but we keep a basic check here
if (typeof window !== 'undefined' && !(window as any).global) {
  try {
    (window as any).global = window;
  } catch (e) {}
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
