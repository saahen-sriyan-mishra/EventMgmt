UPDATE Events
SET current_capacity = (
    SELECT SUM(tickets_booked)
    FROM Booked
    WHERE Booked.event_booked = Events.eventid
)
WHERE EXISTS (
    SELECT 1
    FROM Booked
    WHERE Booked.event_booked = Events.eventid
);