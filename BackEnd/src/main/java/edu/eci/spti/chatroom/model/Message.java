package edu.eci.spti.chatroom.model;

/**
 *
 * @author Oscar Lesmes
 */
public class Message {
    String remitente;
    String mensaje;

    public Message (){
    }

    public Message(String remitente, String mensaje){
        this.remitente = remitente;
        this.mensaje = mensaje;
    }

    public void setMensaje(String mensaje){
        this.mensaje = mensaje;
    }

    public String getMensaje(){
        return mensaje;
    }

    public void setRemitente(String remitente){
        this.remitente = remitente;
    }

    public String getRemitente(){
        return remitente;
    }
}
