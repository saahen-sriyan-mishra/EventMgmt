CREATE TABLE Location (
    venueid INTEGER PRIMARY KEY AUTOINCREMENT,
    event_name VARCHAR(255),
    event_theme VARCHAR(255),
    venue_name VARCHAR(255) DEFAULT 'unassigned',
    event_datetime DATETIME,
    longitude REAL DEFAULT 0.000000,
    latitude REAL DEFAULT 0.000000,
    eventid INTEGER,
    FOREIGN KEY (eventid) REFERENCES Events(eventid)
);
