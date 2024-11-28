import React, { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';
import axios from 'axios';
import './styles/socketsCommunication.css';

function AppChat() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [sala, setSala] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [mensajesRecibidos, setMensajesRecibidos] = useState([]);
  const [salasDisponibles, setSalasDisponibles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ username: '', password: '', salaToDelete: '' });
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
    fetch("http://18.234.126.38:8080/api/salas/todas")
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
      socket.emit('enviar_mensaje', mensajeData);
      setMensaje('');

      fetch(`http://18.234.126.38:8080/api/salas/${sala}/mensaje`, {
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
      fetch("http://18.234.126.38:8080/api/salas/nueva", {
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
            const newSocket = io('http://18.234.126.38.63:8085', {
              transports: ['websocket'],
              query: { room: nombreSala }
            });
            setSocket(newSocket);
            fetchSalasDisponibles();
          } else {
            alert("Error al crear la sala.");
          }
        })
        .catch(() => {
          alert("Error en la solicitud de creación de sala.");
        });
    }
  };

  const seleccionarSala = (nombreSala) => {
    setSala(nombreSala);
    const newSocket = io('http://18.234.126.38:8085', {
      transports: ['websocket'],
      query: { room: nombreSala }
    });
    setNombreUsuario(prompt("Ingrese el nombre de usuario:"));
    setSocket(newSocket);
  };

  const solicitarCredenciales = (nombreSala) => {
    setModalData({ username: '', password: '', salaToDelete: nombreSala });
    setShowModal(true);
  };


  const borrarSala = async () => {
    const { username, password, salaToDelete } = modalData;

    if (!username || !password) {
        alert("Se requieren credenciales para eliminar una sala.");
        return;
    }

    const credentials = btoa(`${username}:${password}`);
    const salaData = { nombreSala: salaToDelete };

    try {
        const response = await fetch("http://18.234.126.38:8080/api/salas/eliminar", {
            method: "DELETE",
            headers: new Headers({
                "Authorization": `Basic ${credentials}`,
                "Content-Type": "application/json"
            }),
            body: JSON.stringify(salaData)
        });

        if (response.ok) {
            console.log(`Sala "${salaToDelete}" borrada exitosamente`);
            fetchSalasDisponibles();
            if (sala === salaToDelete) {
                desconectarSala();
            }
        } else if (response.status === 401) {
            alert("Credenciales incorrectas. No estás autorizado para eliminar esta sala.");
        } else {
            alert("Error al intentar borrar la sala.");
        }
    } catch (error) {
        console.error("Error en la solicitud de eliminación de sala:", error);
        alert("Error en la solicitud de eliminación de sala.");
    } finally {
        setShowModal(false);
    }
};



  const desconectarSala = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setSala('');
    }
  };

  return (
    <div className="AppChat">
      <h2>{isConnected ? `Conectado a la sala ${sala}` : 'No conectado'}</h2>
      <div className="container">
        <div className="salas-disponibles">
          <h3>Salas disponibles:</h3>
          <ul>
            {salasDisponibles.map((salaObj, index) => (
              <li key={index} className={sala === salaObj.nombreSala ? "sala-seleccionada" : ""}>
                {salaObj.nombreSala}
                <button onClick={() => seleccionarSala(salaObj.nombreSala)}>Seleccionar</button>
                <button onClick={() => solicitarCredenciales(salaObj.nombreSala)}>Borrar Sala</button>
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

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Credenciales requeridas</h3>
            <label>
              Nombre de usuario:
              <input
                type="text"
                value={modalData.username}
                onChange={(e) => setModalData({ ...modalData, username: e.target.value })}
              />
            </label>
            <label>
              Contraseña:
              <input
                type="password"
                value={modalData.password}
                onChange={(e) => setModalData({ ...modalData, password: e.target.value })}
              />
            </label>
            <button onClick={borrarSala}>Confirmar</button>
            <button onClick={() => setShowModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppChat;
