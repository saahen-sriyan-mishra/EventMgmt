import express from 'express';  // ES Module import
import sqlite3 from 'sqlite3';  // ES Module import
import cors from 'cors';        // ES Module import

import { fileURLToPath } from 'url';
import path from 'path';
import process from 'process'; // Explicit import

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite Database Setup
const dbPath = process.env.DB_PATH || '../backend/eventmanagement.db';
const db = new sqlite3.Database(dbPath);

// Get the username by email
app.get('/api/username/:email', (req, res) => {
  const email = req.params.email;

  db.get(`SELECT Username FROM Users WHERE Email = ?`, [email], (err, row) => {
    if (err) {
      console.error('Error fetching username:', err);
      return res.status(500).send('Error fetching username');
    }
    if (!row) {
      return res.status(404).send('User not found');
    }
    res.json({ username: row.Username });
  });
});

// Update the username by email
app.put('/api/username/:email', (req, res) => {
  const email = req.params.email;
  const { username } = req.body;

  // Ensure the username is provided
  if (!username || username.trim() === '') {
    return res.status(400).send('Invalid username');
  }

  db.run(
    `UPDATE Users
     SET Username = ?
     WHERE Email = ?`,
    [username, email],
    function (err) {
      if (err) {
        console.error('Error updating username:', err);
        return res.status(500).send('Error updating username');
      }
      if (this.changes === 0) {
        return res.status(404).send('User not found');
      }
      console.log(`Username updated for email: ${email}`);
      res.send('Username updated successfully');
    }
  );
});

// Fetch all events and associated location data
app.get('/api/events', (req, res) => {
  const query = `
    SELECT
        e.eventid,
        e.name AS event_name,
        e.theme AS event_theme,
        e.description AS event_description,
        e.max_capacity,
        e.current_capacity,
        e.ticket_price,
        e.event_datetime,
        l.venue_name,
        l.latitude,
        l.longitude
    FROM
        Events e
    JOIN
        Location l ON e.eventid = l.eventid;
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching events and location data:', err);
      return res.status(500).send('Error fetching events and location data');
    }

    res.json(rows); // Send the events and locations data as a JSON response
  });
});







app.post('/api/book-event', (req, res) => {
  const { email, eventId } = req.body;

  // First, check event capacity
  db.get(
    `SELECT max_capacity, current_capacity FROM Events WHERE eventid = ?`,
    [eventId],
    (err, event) => {
      if (err) {
        console.error('Error checking event capacity:', err);
        return res.status(500).send('Error checking event capacity');
      }

      if (!event) {
        return res.status(404).send('Event not found');
      }

      // Check if the event is full
      if (event.current_capacity >= event.max_capacity) {
        return res.status(400).send('Event is already at full capacity');
      }

      // Get the user id based on the email
      db.get(
        `SELECT Id FROM Users WHERE Email = ?`,
        [email],
        (err, user) => {
          if (err) {
            console.error('Error fetching user by email:', err);
            return res.status(500).send('Error fetching user by email');
          }

          if (!user) {
            return res.status(404).send('User not found');
          }

          const userId = user.Id;

          // Check if the user has already booked this event
          db.get(
            `SELECT tickets_booked FROM Booked WHERE useremail_id = ? AND event_booked = ?`,
            [userId, eventId],
            (err, row) => {
              if (err) {
                console.error('Error checking existing booking:', err);
                return res.status(500).send('Error checking existing booking');
              }

              if (row) {
                // User has already booked this event, increment the tickets_booked
                const newTicketCount = row.tickets_booked + 1;

                db.run(
                  `UPDATE Booked SET tickets_booked = ? WHERE useremail_id = ? AND event_booked = ?`,
                  [newTicketCount, userId, eventId],
                  function (err) {
                    if (err) {
                      console.error('Error updating tickets_booked:', err);
                      return res.status(500).send('Error updating booking');
                    }

                    // Also increment event's current capacity
                    db.run(
                      `UPDATE Events SET current_capacity = current_capacity + 1 WHERE eventid = ?`,
                      [eventId],
                      function (err) {
                        if (err) {
                          console.error('Error updating event capacity:', err);
                          return res.status(500).send('Error updating event capacity');
                        }
                        res.send('Booking updated successfully');
                      }
                    );
                  }
                );
              } else {
                // User hasn't booked this event, create a new booking with 1 ticket
                db.run(
                  `INSERT INTO Booked (useremail_id, event_booked, tickets_booked, email) 
                   VALUES (?, ?, 1, ?)`,
                  [userId, eventId, email], // Now include the email in the insert statement
                  function (err) {
                    if (err) {
                      console.error('Error creating booking:', err);
                      return res.status(500).send('Error creating booking');
                    }

                    // Also increment event's current capacity
                    db.run(
                      `UPDATE Events SET current_capacity = current_capacity + 1 WHERE eventid = ?`,
                      [eventId],
                      function (err) {
                        if (err) {
                          console.error('Error updating event capacity:', err);
                          return res.status(500).send('Error updating event capacity');
                        }
                        res.send('Booking created successfully');
                      }
                    );
                  }
                );
              }
            }
          );
        }
      );
    }
  );
});







app.get('/api/booked-events/:email', (req, res) => {
  const email = req.params.email;

  const query = `
    SELECT 
      e.eventid,
      e.name AS event_name,
      e.theme AS event_theme,
      e.description AS event_description,
      e.event_datetime,
      l.venue_name,
      b.tickets_booked,
      b.email AS user_email  -- Add the email field from the Booked table
    FROM
      Events e
    JOIN
      Location l ON e.eventid = l.eventid
    JOIN
      Booked b ON e.eventid = b.event_booked
    JOIN
      Users u ON b.useremail_id = u.Id
    WHERE
      u.Email = ?
  `;

  db.all(query, [email], (err, rows) => {
    if (err) {
      console.error('Error fetching booked events:', err);
      return res.status(500).send('Error fetching booked events');
    }
    res.json(rows);
  });
});






// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
