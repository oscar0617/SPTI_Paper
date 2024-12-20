package edu.eci.spti.chatroom.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;


@Entity
public class Sala implements Serializable {

    @Id
    private String nombre;

    private transient List<Message> mensajes = new ArrayList<>();

    public Sala() {
    }

    public Sala(String nombreSala) {
        this.nombre = nombreSala;
    }

    public String getNombreSala() {
        return nombre;
    }

    public void setNombreSala(String nombreSala) {
        this.nombre = nombreSala;
    }

    public List<Message> getMensajes() {
        return mensajes;
    }

    public void addMessage(Message message) {
        mensajes.add(message);
    }
}
