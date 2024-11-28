package edu.eci.spti.chatroom.controller;

import edu.eci.spti.chatroom.model.Message;
import edu.eci.spti.chatroom.model.Sala;
import edu.eci.spti.chatroom.service.SalaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/salas")
@CrossOrigin(origins = "*")
public class SalaController {

    @Autowired
    private SalaService salaService;

    @PostMapping("/nueva")
    public ResponseEntity<String> createSala(@RequestBody Map<String, String> request) {
        String nombreSala = request.get("nombreSala");
        salaService.newSala(nombreSala);
        return ResponseEntity.ok("Sala creada exitosamente: " + nombreSala);
    }

    @PostMapping("/{nombreSala}/mensaje")
    public ResponseEntity<String> addMessage(@PathVariable String nombreSala, @RequestBody Message message) {
        salaService.addNewMessage(nombreSala, message);
        return ResponseEntity.ok("Mensaje agregado a la sala: " + nombreSala);
    }

    @GetMapping("/todas")
    public ResponseEntity<List<Sala>> getAllSalas() {
        List<Sala> salas = salaService.getAllSalas();
        return ResponseEntity.ok(salas);
    }

    @DeleteMapping("/eliminar")
    public ResponseEntity<String> deleteSala(@RequestBody Map<String, String> request) {
        String nombreSala = request.get("nombreSala");
        salaService.deleteSala(nombreSala);
        return ResponseEntity.ok("Sala eliminada: " + nombreSala);
    }
}
