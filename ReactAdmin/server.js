import express from 'express'; // ES module import
import sqlite3 from 'sqlite3'; // ES module import
import cors from 'cors'; // ES module import


import { fileURLToPath } from 'url';
import path from 'path';
import process from 'process'; // Explicit import

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const app = express();
const port = 3002;

// Database Connection
const dbPath = process.env.DB_PATH || '../backend/eventmanagement.db';
const db = new sqlite3.Database(dbPath);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// API to Insert Data
app.post('/api/events', (req, res) => {
  const { name, theme, description, max_capacity, ticket_price, event_datetime } = req.body;

  if (!name || !max_capacity || !ticket_price || !event_datetime) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  const sql = `INSERT INTO Events (name, theme, description, max_capacity, ticket_price, event_datetime) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [name, theme || '', description || '', max_capacity, ticket_price, event_datetime];

  db.run(sql, values, function (err) {
    if (err) {
      console.error('Error inserting event:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Event created successfully', eventId: this.lastID });
  });
});

// API to fetch events
app.get('/api/events', (req, res) => {
    db.all('SELECT * FROM Events', [], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
});

// Update Event API
app.put('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const { name, theme, description, max_capacity, ticket_price, event_datetime } = req.body;

  const updateEventSql = `UPDATE Events 
                          SET name = ?, theme = ?, description = ?, max_capacity = ?, ticket_price = ?, event_datetime = ?
                          WHERE eventid = ?`;

  db.run(updateEventSql, [name, theme, description, max_capacity, ticket_price, event_datetime, id], function (err) {
    if (err) {
      console.error('Error updating event:', err.message);
      return res.status(500).json({ error: 'Failed to update event.' });
    }

    const updateLocationSql = `UPDATE Location 
                               SET event_name = ?, event_theme = ?
                               WHERE eventid = ?`;

    db.run(updateLocationSql, [name, theme, id], function (err) {
      if (err) {
        console.error('Error updating location:', err.message);
        return res.status(500).json({ error: 'Failed to update location.' });
      }

      res.json({ message: 'Event and Location updated successfully!' });
    });
  });
});

// API to fetch venues
app.get('/api/venues', (req, res) => {
  const sql = 'SELECT * FROM Location';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Update Venue API
app.put('/api/venues/:id', (req, res) => {
  const { id } = req.params;
  const { venue_name, longitude, latitude } = req.body;

  const sql = `UPDATE Location 
               SET venue_name = ?, longitude = ?, latitude = ?
               WHERE venueid = ?`;

  db.run(sql, [venue_name, longitude, latitude, id], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to update venue.' });
    }
    res.json({ message: 'Venue updated successfully!' });
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
