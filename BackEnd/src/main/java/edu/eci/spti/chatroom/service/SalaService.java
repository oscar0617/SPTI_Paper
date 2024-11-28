package edu.eci.spti.chatroom.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.eci.spti.chatroom.model.Message;
import edu.eci.spti.chatroom.model.Sala;
import edu.eci.spti.chatroom.repository.SalaRepository;

@Service
public class SalaService {
    
    @Autowired
    private SalaRepository salaRepository;

    public void newSala(String nombreSala) {
        if (salaRepository.findByNombre(nombreSala) == null) {
            Sala salaNueva = new Sala(nombreSala);
            System.out.println("Estoy creando");
            salaRepository.save(salaNueva);
            System.out.println("creada");
        }
    }

    public void addNewMessage(String nombreSala, Message ms) {
        Sala sala = salaRepository.findByNombre(nombreSala);
        if (sala != null) {
            sala.addMessage(ms);
        } else {
            throw new IllegalArgumentException("La sala " + nombreSala + " no existe");
        }
    }

    public List<Sala> getAllSalas() {
        return salaRepository.findAll();
    }

    public void deleteSala(String nombreSala) {
        Sala sala = salaRepository.findByNombre(nombreSala);
        if (sala != null) {
            salaRepository.delete(sala);
        } else {
            throw new IllegalArgumentException("La sala " + nombreSala + " no existe");
        }
    }
}
