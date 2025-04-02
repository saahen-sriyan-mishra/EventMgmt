INSERT INTO Location (eventid, event_name, event_theme, venue_name, event_datetime, longitude, latitude)
SELECT eventid, 
       name AS event_name, 
       theme AS event_theme, 
       'unassigned' AS venue_name, 
       event_datetime, 
       0.000000 AS longitude, 
       0.000000 AS latitude
FROM Events
WHERE eventid IN (1, 2)
AND NOT EXISTS (
      SELECT 1 FROM Location WHERE Location.eventid = Events.eventid
);
