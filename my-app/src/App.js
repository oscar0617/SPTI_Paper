import React, { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';
import './styles/socketsCommunication.css';

function App() {
  const [socket, setSocket] = useState(null); 
  const [isConnected, setIsConnected] = useState(false);
  const [mensaje, setMensaje] = useState(''); 
  const [sala, setNumeroSala] = useState('');
  const [mensajesRecibidos, setMensajesRecibidos] = useState([]);
  
  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log("Conectado al servidor");
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log("Desconectado del servidor");
        setIsConnected(false);
        setNumeroSala('');
      });

      socket.on('nuevo_mensaje', (data) => {
        setMensajesRecibidos(prevMensajes => [...prevMensajes, data]); 
      });

      return () => {
        socket.off('connect');
        socket.off('nuevo_mensaje');
      };
    }
  }, [socket]);


  const enviarMensaje = () => {
    if (mensaje && socket) {
      const remitente = socket.id; 
      const mensajeData = { remitente, mensaje };
      
      socket.emit('enviar_mensaje', mensajeData);  
      console.log(`Mensaje enviado: Remitente: ${remitente}, Mensaje: ${mensaje}`);
      
      setMensaje('');
    } else if (!socket){
      alert('Debes conectarte a una sala');
    }
  };
  
  const conectarseSala = () => {
    const numeroSala = prompt("Ingrese el número de sala:");
    if (numeroSala) {
      const newSocket = io('http://127.0.0.1:8085', {
        transports: ['websocket'],
        query: { room: `sala_${numeroSala}` }
      });
      setSocket(newSocket);
      setNumeroSala(numeroSala); 
    }
  };

  const desconectarSala = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  return (
    <div className="App">
      <h2>{isConnected ? `Conectado a la sala ${sala}` : 'No conectado'}</h2>
      <button onClick={conectarseSala}>Conectarse a la Sala</button>
      <button onClick={desconectarSala}>Desconectarse de la sala de chat</button>
      <div className="mensajes-recibidos">
        <h3>Mensajes recibidos:</h3>
        <ul>
          {mensajesRecibidos.map((msg, index) => (
            <li key={index}>
              <strong>{msg.remitente}:</strong> {msg.mensaje}
            </li>
          ))}
        </ul>
      </div>
      <div>
        Mensaje: 
        <input 
          id="mensaje"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)} 
        />
        <button onClick={enviarMensaje}>Enviar mensaje</button>
      </div>
    </div>
  );
}

export default App;
