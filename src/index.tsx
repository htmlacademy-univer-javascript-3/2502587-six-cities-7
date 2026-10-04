import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/app.tsx';
import { PLACES_COUNT } from './const';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App placesCount={PLACES_COUNT}/>
  </React.StrictMode>
);
