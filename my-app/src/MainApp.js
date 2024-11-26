import React, { useState } from "react";
import Login from "./Login"; // Importa el componente Login
import { useHref } from "react-router-dom";

function MainApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Cambia el estado cuando el login es exitoso
  };

  return (
    <div>
      {isLoggedIn ? (
        <h1>Bienvenido a la Aplicación</h1> // Reemplázalo con tu contenido principal
      ) : (
        <Login onLogin={handleLoginSuccess} />
      )}
    </div>
  );
}

export default MainApp;
