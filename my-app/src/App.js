import React, { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';
import './styles/socketsCommunication.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [sala, setSala] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [mensajesRecibidos, setMensajesRecibidos] = useState([]); 
  const [salasDisponibles, setSalasDisponibles] = useState([]); 
  const mensajesEndRef = useRef(null); 

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log("Conectado al servidor");
        setIsConnected(true);
      });

      socket.on('nuevo_mensaje', (data) => {
        setMensajesRecibidos(prevMensajes => [...prevMensajes, data]);
      });

      socket.on('disconnect', () => {
        console.log("Desconectado del servidor");
        setIsConnected(false);
        setSala('');
        setMensajesRecibidos([]); 
      });

      return () => {
        socket.off('connect');
        socket.off('nuevo_mensaje');
        socket.off('disconnect');
      };
    }
  }, [socket]);

  const fetchSalasDisponibles = () => {
    fetch("http://127.0.0.1:8080/api/salas/todas") 
      .then(response => response.json())
      .then(data => {
        setSalasDisponibles(data);
      })
      .catch(error => console.error("Error al obtener las salas:", error));
  };
  

  useEffect(() => {
    fetchSalasDisponibles();
  }, []);

  useEffect(() => {
    if (mensajesEndRef.current) {
      mensajesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensajesRecibidos]);

  const enviarMensaje = () => {
    if (mensaje && socket) {
      const remitente = nombreUsuario; 
      const mensajeData = { remitente, mensaje };
      console.log(mensajeData);
      socket.emit('enviar_mensaje', mensajeData);
      setMensaje('');
  
      fetch(`http://127.0.0.1:8080/api/salas/${sala}/mensaje`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(mensajeData) 
      })

      .then(response => {
        if (response.ok) {
          console.log(`Mensaje enviado a la sala "${sala}" exitosamente`);
        } else {
          alert("Error al enviar el mensaje.");
        }
      })
      .catch(error => {
        console.error("Error en la solicitud de envío de mensaje:", error);
        alert("Error al enviar el mensaje.");
      });
    } else if (!socket) {
      alert('Debes conectarte a una sala');
    }
  };
  

  const conectarseSala = () => {
    const nombreSala = prompt("Ingrese el nombre de la sala:");
    setNombreUsuario(prompt("Ingrese el nombre de usuario:"));
    if (nombreSala) {
      const salaData = { nombreSala };
      fetch("http://127.0.0.1:8080/api/salas/nueva", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(salaData)
      })
      .then(response => {
        if (response.ok) {
          console.log(`Sala "${nombreSala}" creada exitosamente`);
          setSala(nombreSala);
          const newSocket = io('http://127.0.0.1:8085', {
            transports: ['websocket'],
            query: { room: nombreSala }
          });
          setSocket(newSocket);
          fetchSalasDisponibles();
        } else {
          alert("Error al crear la sala.");
        }
      })
      .catch(error => {
        alert("Error en la solicitud de creación de sala.");
      });
    }
  };

  const seleccionarSala = (nombreSala) => {
    setSala(nombreSala);
    const newSocket = io('http://127.0.0.1:8085', {
      transports: ['websocket'],
      query: { room: nombreSala }
    });
    setNombreUsuario(prompt("Ingrese el nombre de usuario:"));
    setSocket(newSocket);
  };

  const desconectarSala = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setSala('');
    }
  };

  return (
    <div className="App">
      <h2>{isConnected ? `Conectado a la sala ${sala}` : 'No conectado'}</h2>
      <div className="container">
        <div className="salas-disponibles">
          <h3>Salas disponibles:</h3>
          <ul>
            {salasDisponibles.map((salaObj, index) => (
              <li key={index} className={sala === salaObj.nombreSala ? "sala-seleccionada" : ""}>
                {salaObj.nombreSala}
                <button onClick={() => seleccionarSala(salaObj.nombreSala)}>Seleccionar</button>
              </li>
            ))}
          </ul>
          <button onClick={conectarseSala}>Crear Sala</button>
          <button onClick={desconectarSala}>Desconectar</button>
        </div>
        <div className="mensajes-container">
          <div className="mensajes-recibidos">
            <h3>Mensajes recibidos:</h3>
            <ul>
              {mensajesRecibidos.map((msg, index) => (
                <li key={index}>
                  <strong>{msg.remitente}:</strong> {msg.mensaje}
                </li>
              ))}
              <div ref={mensajesEndRef} />
            </ul>
          </div>

          <div className="input-mensaje">
            <input 
              id="mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)} 
              placeholder="Escribe tu mensaje"
            />
            <button onClick={enviarMensaje}>Enviar mensaje</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
