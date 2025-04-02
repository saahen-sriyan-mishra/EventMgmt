import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './admin.scss';

import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [formData, setFormData] = useState({
    name: '',
    theme: '',
    description: '',
    max_capacity: '',
    ticket_price: '',
    event_datetime: '',
  });

  const [venueData, setVenueData] = useState({
    venue_name: '',
    longitude: '',
    latitude: '',
  });

  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editingVenueId, setEditingVenueId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('events');

  const handleChange = (e) => {
    if (e.target.name === 'venue_name' || e.target.name === 'longitude' || e.target.name === 'latitude') {
      setVenueData({ ...venueData, [e.target.name]: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if both event and venue are being edited
      if (editingEventId && editingVenueId) {
        await Promise.all([
          axios.put(`http://localhost:3002/api/events/${editingEventId}`, formData),
          axios.put(`http://localhost:3002/api/venues/${editingVenueId}`, venueData),
        ]);
        setSuccessMessage('Event and Venue updated successfully!');
      } else if (editingEventId) {
        await axios.put(`http://localhost:3002/api/events/${editingEventId}`, formData);
        setSuccessMessage('Event updated successfully!');
      } else {
        await axios.post('http://localhost:3002/api/events', formData);
        setSuccessMessage('Event created successfully!');
      }
      resetForm();
      fetchEvents();
      fetchVenues();
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Error saving data');
    }
  };

  const handleVenueSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3002/api/venues/${editingVenueId}`, venueData);
      setSuccessMessage('Venue updated successfully!');
      setEditingVenueId(null);
      fetchVenues();
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Error saving venue');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      theme: '',
      description: '',
      max_capacity: '',
      ticket_price: '',
      event_datetime: '',
    });
    setVenueData({
      venue_name: '',
      longitude: '',
      latitude: '',
    });
    setEditingEventId(null);
    setEditingVenueId(null);
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchVenues = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/venues');
      setVenues(response.data);
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  const handleEdit = (event) => {
    setEditingEventId(event.eventid);
    setFormData({ ...event });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigate = useNavigate();

  const handleVenueEdit = (venue) => {
    setEditingVenueId(venue.venueid);
    setVenueData({ venue_name: venue.venue_name, longitude: venue.longitude, latitude: venue.latitude });
    window.scrollTo({ top: 1100, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchEvents();
    fetchVenues();
  }, []);
  return (
    <div className="container">

<button 
      className="floating-button"
      onClick={() => navigate('/vendor-att')}
      title="View Vendor Attendance"
    >
      <span>Vendor/Attendee</span>
    </button>

      <h1>{editingEventId ? "Update Event" : "Create Event"}</h1>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Form Section (Event Form) */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Event Theme:</label>
          <input type="text" name="theme" value={formData.theme} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Event Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
        </div>
        <div className="form-group">
          <label>Maximum Capacity:</label>
          <input type="number" name="max_capacity" value={formData.max_capacity} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Ticket Price in ₹ :</label>
          <input type="number" name="ticket_price" value={formData.ticket_price} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Event Date and Time:</label>
          <input type="datetime-local" name="event_datetime" value={formData.event_datetime} onChange={handleChange} required />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
  <button type="submit" className="button update-button">
    {editingEventId ? "Update Event" : "Save Event"}
  </button>
  {editingEventId && (
    <button onClick={resetForm} className="button cancel-button">
      Cancel
    </button>
  )}
</div>
      </form>

      <br/>
      <div style={{
  width: '300px',        // Set the width of the line
  height: '2px',         // Set the thickness of the line
  backgroundColor: 'black', // Set the color of the line
  margin: '20px auto'    // Center the line horizontally with auto margins
}} />
      <br/>
      <br/>

      {/* Tab Switch Buttons */}
      {/*
      <div className="tab-buttons">
        <button onClick={() => setActiveTab('events')} className={activeTab === 'events' ? 'active' : ''}>Events</button>
        <button onClick={() => setActiveTab('venues')} className={activeTab === 'venues' ? 'active' : ''}>Venues</button>
      </div>
      */}

      <div className="tab-buttons" style={{ display: 'flex', gap: '10px' }}>
      <button 
  onClick={() => setActiveTab('events')} 
  className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
>
  View Events
</button>
<button 
  onClick={() => setActiveTab('venues')} 
  className={`tab-button ${activeTab === 'venues' ? 'active' : ''}`}
>
  View Venues
</button>
</div>

      {/* Event Table */}
      {activeTab === 'events' && (
        <div>
          <h2>Event List</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Theme</th>
                <th>Description</th>
                <th>Max Capacity</th>
                <th>Current Capacity</th>
                <th>Ticket Price</th>
                <th>Date & Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr><td colSpan="9">No Events Found</td></tr>
              ) : (
                events.map(event => (
                  <tr key={event.eventid}>
                    <td>{event.eventid}</td>
                    <td>{event.name}</td>
                    <td>{event.theme}</td>
                    <td>{event.description}</td>
                    <td>{event.max_capacity}</td>
                    <td>{event.current_capacity || 0}</td>
                    <td>₹{event.ticket_price}</td>
                    <td>{new Date(event.event_datetime).toLocaleString()}</td>
                    <td>
                      <button className="update-btn" onClick={() => handleEdit(event)}>Update</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Venue Table */}
      {activeTab === 'venues' && (
        <div>
          <h2>Venue List</h2>

                {/* Venue Edit Form */}
      {editingVenueId && (
        <form onSubmit={handleVenueSubmit}>
          <h3>Edit Venue for {venues.find(venue => venue.venueid === editingVenueId)?.event_name}</h3>
          <div className="form-group">
            <label>Venue Name:</label>
            <input type="text" name="venue_name" value={venueData.venue_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Latitude:</label>
            <input type="number" name="latitude" value={venueData.latitude} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Longitude:</label>
            <input type="number" name="longitude" value={venueData.longitude} onChange={handleChange} required />
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="button update-button">
  Update Venue
</button>
<button onClick={() => setEditingVenueId(null)} className="button cancel-button">
  Cancel
</button>
</div>
        </form>
      )}
          <table>
            <thead>
              <tr>
                <th>Venue ID</th>
                <th>Event Name</th>
                <th>Event Theme</th>
                <th>Venue Name</th>
                <th>Event Date and Time</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {venues.length === 0 ? (
                <tr><td colSpan="8">No Venues Found</td></tr>
              ) : (
                venues.map(venue => (
                  <tr key={venue.venueid}>
                    <td>{venue.venueid}</td>
                    <td>{venue.event_name}</td>
                    <td>{venue.event_theme}</td>
                    <td>{venue.venue_name}</td>
                    <td>{new Date(venue.event_datetime).toLocaleString()}</td>
                    <td>{venue.latitude}</td>
                    <td>{venue.longitude}</td>
                    <td>
                      <button className="update-btn" onClick={() => handleVenueEdit(venue)}>Edit Venue</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        
      )}
    </div>
  );
};

export default Admin;
