package com.pxp.SQLite.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.pxp.SQLite.demo.dto.BookedDTO;
import com.pxp.SQLite.demo.service.BookedService;

@RestController
@CrossOrigin(origins = "http://localhost:5174")
public class BookedController {

    @Autowired
    private BookedService bookedService;

    
    @RequestMapping(value = "getbooked", method = RequestMethod.GET)
    public List<BookedDTO> getBooked() {
        return bookedService.getAllBookings();
    }
}