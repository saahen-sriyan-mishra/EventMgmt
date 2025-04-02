CREATE TABLE Booked (
    id INTEGER PRIMARY KEY AUTOINCREMENT,          -- Auto-incrementing primary key
    useremail_id INTEGER,                          -- Foreign key referencing Users table
    event_booked INTEGER,                          -- Foreign key referencing Events table
    tickets_booked INTEGER NOT NULL DEFAULT 1,      -- Number of tickets the user is booking for the event
    FOREIGN KEY (useremail_id) REFERENCES Users(Id) ON DELETE CASCADE,  -- Foreign key constraint to Users
    FOREIGN KEY (event_booked) REFERENCES Events(eventid) ON DELETE CASCADE  -- Foreign key constraint to Events
);
