import React from 'react';
import ReactDOM from 'react-dom/client';
import AppChat from './AppChat'; // Importa MainApp, que maneja el flujo de login
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppChat /> {/* Renderiza MainApp para gestionar el login */}
  </React.StrictMode>
);

// Si deseas empezar a medir el rendimiento de tu aplicación, pasa una función
// para registrar los resultados (por ejemplo: reportWebVitals(console.log))
// o envíalos a un endpoint de análisis. Más información: https://bit.ly/CRA-vitals
reportWebVitals();
