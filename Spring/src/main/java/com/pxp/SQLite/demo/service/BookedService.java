package com.pxp.SQLite.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pxp.SQLite.demo.dto.BookedDTO;
import com.pxp.SQLite.demo.entity.Booked;
import com.pxp.SQLite.demo.repository.BookedRepository;

@Service
public class BookedService {

    @Autowired
    private BookedRepository bookedRepository;

    public List<BookedDTO> getAllBookings() {
        List<Booked> bookings = bookedRepository.findAll();
        return bookings.stream()
                .map(booking -> new BookedDTO(
                        booking.getId(),
                        booking.getUseremailId(),
                        booking.getEventBooked(),
                        booking.getTicketsBooked(),
                        booking.getEmail()))
                .collect(Collectors.toList());
    }
}