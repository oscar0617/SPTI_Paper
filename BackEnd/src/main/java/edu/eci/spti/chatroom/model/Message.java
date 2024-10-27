package edu.eci.spti.chatroom.model;

public class Message {
    private String remitente;
    private String mensaje;

    public Message() {
    }

    public Message(String remitente, String mensaje) {
        this.remitente = remitente;
        this.mensaje = mensaje;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getRemitente() {
        return remitente;
    }

    public void setRemitente(String remitente) {
        this.remitente = remitente;
    }
}
