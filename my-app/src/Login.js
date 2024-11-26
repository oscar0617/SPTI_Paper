import React, { useState } from "react";
import './styles/styles.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  
    const handleLogin = async (event) => {
      event.preventDefault();
  
      try {
          const response = await fetch(
              `http://127.0.0.1:8080/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
              {
                  method: "GET", 
              }
          );

          if (response.ok) {
              setErrorMessage("");
              console.log(response.json)
              console.log("a")
              window.location.href = '/index';
          } else if (response.status === 401) {
              setErrorMessage("Invalid username or password");
          } else {
              setErrorMessage("Unexpected error occurred");
          }
      } catch (error) {
          console.error("Error connecting to server:", error);
          setErrorMessage("Failed to connect to server");
      }
    };
    
    
  
    return (
      <div className="App">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          {errorMessage && <div className="message">{errorMessage}</div>}
          <div>
            <input
              type="text"
              placeholder="Nombre de Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
  
  export default Login;