DROP TRIGGER IF EXISTS after_event_insert;

CREATE TRIGGER after_event_insert
AFTER INSERT ON Events
BEGIN
    INSERT INTO Location (eventid, event_name, event_theme, venue_name, event_datetime, longitude, latitude)
    VALUES (
        NEW.eventid,
        NEW.name,
        NEW.theme,
        'unassigned',
        NEW.event_datetime,
        0.000000,
        0.000000
    );
END;
