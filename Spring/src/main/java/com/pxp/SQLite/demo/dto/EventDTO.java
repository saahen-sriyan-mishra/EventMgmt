package com.pxp.SQLite.demo.dto;

public class EventDTO {

    private int eventid;
    private String name;
    private String theme;
    private String description;
    private int maxCapacity;
    private int currentCapacity;
    private int ticketPrice;
    private String eventDatetime;

    public EventDTO(int eventid, String name, String theme, String description, int maxCapacity, 
                    int currentCapacity, int ticketPrice, String eventDatetime) {
        this.eventid = eventid;
        this.name = name;
        this.theme = theme;
        this.description = description;
        this.maxCapacity = maxCapacity;
        this.currentCapacity = currentCapacity;
        this.ticketPrice = ticketPrice;
        this.eventDatetime = eventDatetime;
    }

    // Getters and setters
    public int getEventid() {
        return eventid;
    }

    public void setEventid(int eventid) {
        this.eventid = eventid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(int maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public int getCurrentCapacity() {
        return currentCapacity;
    }

    public void setCurrentCapacity(int currentCapacity) {
        this.currentCapacity = currentCapacity;
    }

    public int getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(int ticketPrice) {
        this.ticketPrice = ticketPrice;
    }

    public String getEventDatetime() {
        return eventDatetime;
    }

    public void setEventDatetime(String eventDatetime) {
        this.eventDatetime = eventDatetime;
    }
}
