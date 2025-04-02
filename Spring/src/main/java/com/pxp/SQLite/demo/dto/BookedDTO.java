package com.pxp.SQLite.demo.dto;

public class BookedDTO {
    private int id;
    private int useremailId;
    private int eventBooked;
    private int ticketsBooked;
    private String email;

    public BookedDTO() {
    }

    public BookedDTO(int id, int useremailId, int eventBooked, int ticketsBooked, String email) {
        this.id = id;
        this.useremailId = useremailId;
        this.eventBooked = eventBooked;
        this.ticketsBooked = ticketsBooked;
        this.email = email;
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