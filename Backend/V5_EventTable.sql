CREATE TABLE Events (
    eventid INTEGER PRIMARY KEY AUTOINCREMENT,  -- Auto-incrementing unique ID
    name TEXT NOT NULL,                         -- Event name
    theme TEXT,                                 -- Event theme
    description TEXT,                           -- Event description
    max_capacity INTEGER NOT NULL,             -- Maximum allowed attendees
    current_capacity INTEGER DEFAULT 0,        -- Initially 0 bookings
    ticket_price INTEGER NOT NULL,             -- Price per ticket
    event_datetime DATETIME NOT NULL           -- Date and time of the event
);