import React from 'react';
import ReactDOM from 'react-dom/client';

// Components
import Main from './main';

const appContainer: HTMLElement = document.querySelector('main[role="main"]')!;
const root: ReactDOM.Root = ReactDOM.createRoot(appContainer);

root.render(
  <React.StrictMode>
    <Main/>
  </React.StrictMode>
)
