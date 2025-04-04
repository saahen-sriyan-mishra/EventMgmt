package com.pxp.SQLite.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.pxp.SQLite.demo.entity.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

    // Find events by theme
    public List<Event> findByTheme(String theme);

    // Check if an event exists by name
    public boolean existsByName(String name);

    // Fetch the event with the highest ID
    @Query("SELECT MAX(e.eventid) FROM Event e")
    public Integer findMaxEventId();
}