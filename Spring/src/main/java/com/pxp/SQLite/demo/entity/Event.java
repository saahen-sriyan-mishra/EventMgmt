package com.pxp.SQLite.demo.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Events")  // Explicitly map to the Events table
public class Event {

    @Id
    private int eventid;  // Event ID

    private String name;  // Event name

    private String theme;  // Event theme

    private String description;  // Event description

    private int maxCapacity;  // Maximum allowed attendees

    private int currentCapacity;  // Current number of attendees

    private int ticketPrice;  // Price per ticket

    private String eventDatetime;  // Event date and time

    // Default constructor
    public Event() {
    }

    // Getters and setters for each field
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

    // Optional: Override toString method for better debugging/logging
    @Override
    public String toString() {
        return "Event{" +
                "eventid=" + eventid +
                ", name='" + name + '\'' +
                ", theme='" + theme + '\'' +
                ", description='" + description + '\'' +
                ", maxCapacity=" + maxCapacity +
                ", currentCapacity=" + currentCapacity +
                ", ticketPrice=" + ticketPrice +
                ", eventDatetime='" + eventDatetime + '\'' +
                '}';
    }
}
