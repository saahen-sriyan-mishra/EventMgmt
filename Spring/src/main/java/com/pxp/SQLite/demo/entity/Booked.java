package com.pxp.SQLite.demo.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Booked")
public class Booked {

    @Id
    private int id;
    private int useremailId;
    private int eventBooked;
    private int ticketsBooked;
    private String email;

    public Booked() {
    }

    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUseremailId() {
        return useremailId;
    }

    public void setUseremailId(int useremailId) {
        this.useremailId = useremailId;
    }

    public int getEventBooked() {
        return eventBooked;
    }

    public void setEventBooked(int eventBooked) {
        this.eventBooked = eventBooked;
    }

    public int getTicketsBooked() {
        return ticketsBooked;
    }

    public void setTicketsBooked(int ticketsBooked) {
        this.ticketsBooked = ticketsBooked;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}