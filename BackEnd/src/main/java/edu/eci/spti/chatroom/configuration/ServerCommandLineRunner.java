package edu.eci.spti.chatroom.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;

import edu.eci.spti.chatroom.model.Message;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.AckRequest;

@Component
public class ServerCommandLineRunner implements CommandLineRunner {

    private final SocketIOServer server;

    @Autowired
    public ServerCommandLineRunner(SocketIOServer server) {
        this.server = server;
    }

    @Override
    public void run(String... args) throws Exception {
        server.start();
        System.out.println("Socket.IO server started on port " + server.getConfiguration().getPort());
        
        server.addConnectListener(new ConnectListener() {
            @Override
            public void onConnect(SocketIOClient client) {
                System.out.println("Conexión exitosa de cliente con ID: " + client.getSessionId());
            }
        });

        server.addEventListener("enviar_mensaje", Message.class, new DataListener<Message>() {
            @Override
            public void onData(SocketIOClient client, Message data, AckRequest ackRequest) {
                String room = client.getHandshakeData().getSingleUrlParam("room");

                if (room == null || room.isEmpty()) {
                    System.out.println("No se especificó una sala para el cliente " + client.getSessionId());
                    return;
                }

                System.out.println("Mensaje recibido en la sala: " + room + " del remitente: " + client.getSessionId() + data.getRemitente());

                client.joinRoom(room);

                server.getRoomOperations(room).sendEvent("nuevo_mensaje", data);

                if (ackRequest.isAckRequested()) {
                    ackRequest.sendAckData("Punto recibido correctamente en la sala " + room);
                }
            }
        });

        server.addDisconnectListener(new DisconnectListener() {
            @Override
            public void onDisconnect(SocketIOClient client) {
                System.out.println("Cliente con ID: " + client.getSessionId() + " se ha desconectado.");
            }
        });

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("Stopping Socket.IO server...");
            server.stop();
        }));
    }
}
