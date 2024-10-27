package edu.eci.spti.chatroom.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import edu.eci.spti.chatroom.model.Sala;


@Repository
public interface SalaRepository extends JpaRepository<Sala, String> {
    public Sala findByNombre(String nombreSala);

}