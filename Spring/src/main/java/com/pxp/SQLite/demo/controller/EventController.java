package com.pxp.SQLite.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.pxp.SQLite.demo.dto.EventDTO;
import com.pxp.SQLite.demo.service.EventService;

@RestController
@CrossOrigin(origins = "http://localhost:5174") // Added for fetch
public class EventController {

    @Autowired
    private EventService eventService;

    // New endpoint to fetch all events from the 'Events' table
    @RequestMapping(value = "getevents", method = RequestMethod.GET)
    public List<EventDTO> getEvents() {
        System.out.println("Fetching all events from the database...");
        return eventService.getAllEvents();  // Fetches all events as EventDTO objects
    }
}
