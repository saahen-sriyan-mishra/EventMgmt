CREATE TRIGGER after_event_update
AFTER UPDATE ON Events
FOR EACH ROW
BEGIN
    UPDATE Location
    SET event_name = NEW.name,
        event_theme = NEW.theme
    WHERE eventid = NEW.eventid;
END;