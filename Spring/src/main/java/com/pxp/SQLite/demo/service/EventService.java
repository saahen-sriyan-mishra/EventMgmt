package com.pxp.SQLite.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pxp.SQLite.demo.dto.EventDTO;
import com.pxp.SQLite.demo.entity.Event;
import com.pxp.SQLite.demo.repository.EventRepository;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<EventDTO> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return events.stream()
                     .map(event -> new EventDTO(
                         event.getEventid(),
                         event.getName(),
                         event.getTheme(),
                         event.getDescription(),
                         event.getMaxCapacity(),
                         event.getCurrentCapacity(),
                         event.getTicketPrice(),
                         event.getEventDatetime()))
                     .collect(Collectors.toList());
    }
}
