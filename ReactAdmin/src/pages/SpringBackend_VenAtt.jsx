import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SpringBackend_VenAtt.scss';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const VendorAtt = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [eventIdInput, setEventIdInput] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getevents');
        setEvents(response.data);
        setFilteredEvents(response.data);
        setLoading(false);
      } catch (error) {
        setError(`Failed to fetch events: ${error.message}`);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTheme = selectedThemes.length === 0 || selectedThemes.includes(event.theme);
      return matchesSearch && matchesTheme;
    });
    setFilteredEvents(filtered);
  }, [searchTerm, selectedThemes, events]);

  const fetchAttendees = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:8080/getbooked`);
      // Filter attendees by the specified event ID
      const filteredAttendees = response.data.filter(attendee => attendee.eventBooked == eventId);
      setAttendees(filteredAttendees);
    } catch (error) {
      alert(`Failed to fetch attendees: ${error.message}`);
    }
  };

  const handleEventIdSubmit = (e) => {
    e.preventDefault();
    if (!eventIdInput) {
      alert('Please enter an event ID');
      return;
    }
    fetchAttendees(eventIdInput);
  };

  const handleSendReminders = () => {
    setShowModal(true);
  };

  const handleProceed = () => {
    alert(`Reminder emails sent to ${attendees.length} attendees for event ${eventIdInput}`);
    setShowModal(false);
  };

  const handleCancel = () => {
    alert('Reminder sending cancelled');
    setShowModal(false);
  };

  // Calculate totals
  const totalRevenue = filteredEvents.reduce((sum, event) => sum + (event.currentCapacity * event.ticketPrice), 0);
  const totalMaxCapacity = filteredEvents.reduce((sum, event) => sum + event.maxCapacity, 0);
  const totalCurrentCapacity = filteredEvents.reduce((sum, event) => sum + event.currentCapacity, 0);
  const totalTicketPrice = filteredEvents.reduce((sum, event) => sum + event.ticketPrice, 0);
  const totalAvailability = totalMaxCapacity > 0 ? ((totalCurrentCapacity / totalMaxCapacity) * 100).toFixed(2) : 0;

  const uniqueThemes = [...new Set(events.map(event => event.theme))];

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="vendor-att-container">
      <h1>Vendor Revenue Tracking</h1>
      <button onClick={() => navigate(-1)} className="back-button">
        Back to Admin
      </button>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="theme-filters">
          {uniqueThemes.map(theme => (
            <label key={theme}>
              <input
                type="checkbox"
                checked={selectedThemes.includes(theme)}
                onChange={() => {
                  if (selectedThemes.includes(theme)) {
                    setSelectedThemes(selectedThemes.filter(t => t !== theme));
                  } else {
                    setSelectedThemes([...selectedThemes, theme]);
                  }
                }}
              />
              {theme}
            </label>
          ))}
        </div>
      </div>

      {/* Revenue Table */}
      <div className="revenue-table">
        <table>
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Event Name</th>
              <th>Theme</th>
              <th>Max Capacity</th>
              <th>Current Capacity</th>
              <th>Ticket Price</th>
              <th>Availability</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map(event => {
              const availability = ((event.currentCapacity / event.maxCapacity) * 100).toFixed(2);
              const revenue = event.currentCapacity * event.ticketPrice;
              
              return (
                <tr key={event.eventid}>
                  <td>{event.eventid}</td>
                  <td>{event.name}</td>
                  <td>{event.theme}</td>
                  <td>{event.maxCapacity.toLocaleString()}</td>
                  <td>{event.currentCapacity.toLocaleString()}</td>
                  <td>₹{event.ticketPrice.toLocaleString()}</td>
                  <td>
                    <div className="availability-bar">
                      <div 
                        className="availability-fill"
                        style={{ width: `${availability}%` }}
                      ></div>
                      <span className="availability-text">{availability}%</span>
                    </div>
                  </td>
                  <td>₹{revenue.toLocaleString()}</td>
                </tr>
              );
            })}
            
            {/* Totals Row */}
            <tr className="totals-row">
              <td colSpan="3">Totals</td>
              <td>{totalMaxCapacity.toLocaleString()}</td>
              <td>{totalCurrentCapacity.toLocaleString()}</td>
              <td>₹{totalTicketPrice.toLocaleString()}</td>
              <td>{totalAvailability}%</td>
              <td>₹{totalRevenue.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary Statistics */}
      <div className="summary-stats">
        <div className="stat-card">
          <h3>Total Max Capacity</h3>
          <p>{totalMaxCapacity.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>People Attended</h3>
          <p>{totalCurrentCapacity.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Average Ticket Price</h3>
          <p>₹{filteredEvents.length > 0 ? (totalTicketPrice / filteredEvents.length).toFixed(2) : 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Availability</h3>
          <p>{totalAvailability}%</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>₹{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <h2 className="section-header">Attendee Tracker</h2>
      <div className="attendee-tracker">
        <div className="event-id-search">
          <form onSubmit={handleEventIdSubmit}>
            <input
              type="number"
              placeholder="Enter Event ID"
              value={eventIdInput}
              onChange={(e) => setEventIdInput(e.target.value)}
            />
            <button type="submit">Search Attendees</button>
          </form>
        </div>

        {attendees.length > 0 && (
          <>
            <h3>Attendees for Event ID: {eventIdInput}</h3>
            <table className="attendees-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Tickets Booked</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((attendee, index) => (
                  <tr key={index}>
                    <td>{attendee.email}</td>
                    <td>{attendee.ticketsBooked}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <button 
              onClick={handleSendReminders}
              className="reminder-button"
            >
              Send Reminder to All
            </button>
          </>
        )}

        {/* Modal for sending reminders */}
        <Modal show={showModal} onHide={handleCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Reminder</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            You are about to send reminder emails to all {attendees.length} confirmed ticket holders for event {eventIdInput}.
            Are you sure you want to proceed?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleProceed}>
              Proceed
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default VendorAtt;