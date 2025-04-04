
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import "./Profile.scss";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';


const Profile = () => {
  const [username, setUsername] = useState('_______');
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [uniqueThemes, setUniqueThemes] = useState([]);

  // State to store selected event ID
  const [selectedEventId, setSelectedEventId] = useState(null);

  //Location/Venue
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('user');

  //Booking Confirm
  const [show, setShow] = useState(false);


  //Show events
  const [bookedEvents, setBookedEvents] = useState([]);

  //Unassigned handelling
  const [showVenueModal, setShowVenueModal] = useState(false);
  


  useEffect(() => {
    if (email) {
      axios.get(`/api/username/${email}`)
        .then(response => setUsername(response.data.username || '_______'))
        .catch(error => console.error('Error fetching username:', error));
    } else {
      console.error('No email provided in the URL');
      alert('Invalid email. Please check the URL.');
    }
  }, [email]);




  // Event and location fetch
  useEffect(() => {
    axios.get('/api/events')
      .then(response => {
        setEvents(response.data);
        // Extract unique themes for filtering
        const themes = [...new Set(response.data.map(event => event.event_theme))];
        setUniqueThemes(themes);
      })
      .catch(error => {
        console.error('Error fetching events and locations:', error);
        alert('Error fetching event data');
      });
  }, []);

{/*}
  // Open Maps Not Needed co complex map function
  const openGoogleMaps = (latitude, longitude) => {
    // Adjust longitude, shift location 300 meters to right
    const adjustedLongitude = longitude + 0.0025;
    const googleMapsURL = `https://www.google.com/maps?q=${latitude},${adjustedLongitude}`;
    window.open(googleMapsURL, '_blank');
  };
*/}
  const openGoogleMaps2 = (venue_name) => {
    const googleMapsURL = `https://www.google.com/maps?q=${venue_name}`;
    window.open(googleMapsURL, '_blank');
  };



  // User profile name
  const handleEdit = () => {
    setNewUsername(username);
    setEditMode(true);
  };

  const handleSave = () => {
    if (!email) {
      alert('Invalid email. Cannot save changes.');
      return;
    }

    if (newUsername.trim() === '') {
      alert('Username cannot be empty!');
      return;
    }

    axios.put(`/api/username/${email}`, { username: newUsername })
      .then(() => {
        setUsername(newUsername);
        setEditMode(false);
      })
      .catch(error => console.error('Error updating username:', error));
  };


  // Theme
  const handleThemeChange = (theme) => {
    setSelectedThemes(prevSelected => 
      prevSelected.includes(theme) 
        ? prevSelected.filter(t => t !== theme) 
        : [...prevSelected, theme]
    );
  };


  //Booking
  const handleShow = (eventId) => {
    setSelectedEventId(eventId);
    setShow(true);
  };
  const handleClose = () => setShow(false);


  // Modify the "Yes" button handler
  const handleConfirmBooking = () => {
    if (!email || !selectedEventId) {
      alert('Invalid booking information');
      return;
    }
  
    axios.post('/api/book-event', { email, eventId: selectedEventId })
      .then(() => {
        alert('Booking confirmed!');
        // Refresh events data to show updated capacity
        axios.get('/api/events')
          .then(response => setEvents(response.data))
          .catch(error => console.error('Error refreshing events:', error));
      })
      .catch(error => {
        console.error('Error booking event:', error);
        alert('Error processing booking');
      })
      .finally(() => {
        handleClose();
      });
  };
  


  //Booked
  // Fetch booked events for the user
  useEffect(() => {
      if (email) {
        axios.get(`/api/booked-events/${email}`)
          .then(response => setBookedEvents(response.data))
          .catch(error => {
            console.error('Error fetching booked events:', error);
            alert('Error fetching booked events');
          });
      }
    }, [email]);


      //Unassigned handelling
      const handleViewLocation = (venueName) => {
        console.log('Venue Name:', venueName);
        if (venueName.toLowerCase() === 'unassigned') {
          setShowVenueModal(true);
        } else {
          openGoogleMaps2(venueName);
        }
      };
      



  // Filter
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.event_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTheme = selectedThemes.length === 0 || selectedThemes.includes(event.event_theme);
    return matchesSearch && matchesTheme;
  });



  return (
    <div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1>Welcome, {username}</h1>
        <div style={{ marginTop: '20px' }}>
          {!editMode ? (
            <button onClick={handleEdit}>Edit Profile</button>
          ) : (
            <div>
              <label>
                New Username:
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter your new username"
                />
              </label>
              <button onClick={handleSave} style={{ marginLeft: '10px' }}>
                Save
              </button>
            </div>
          )}
        </div>
      </div>



      <br/>

<div
style={{
  width: '90vw',
  height: '2px',
  backgroundColor: 'black', 
  margin: '0 auto',
}}
/>


{/* //Code to show booked events */}
<h1>Booked Events</h1>
      {/* Table to display booked events */}
      <div className="booked-events-table">
        {bookedEvents.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Event Theme</th>
                <th>Event Description</th>
                <th>Event Date and Time</th>
                <th>Venue Name</th>
                <th>Tickets Booked</th>
                <th>View Location</th>
              </tr>
            </thead>
            <tbody>
              {bookedEvents.map((event, index) => (
                <tr key={index}>
                  <td>{event.event_name}</td>
                  <td>{event.event_theme}</td>
                  <td>{event.event_description}</td>
                  <td>{new Date(event.event_datetime).toLocaleString()}</td>
                  <td>{event.venue_name}</td>
                  <td>{event.tickets_booked}</td>
                  <td>
                  <button
        onClick={() => handleViewLocation(event.venue_name)}
        style={{
          backgroundColor: '#4CAF50',
          color: '#fff',
          padding: '5px 10px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        View Location
      </button>

            {/* Modal for unassigned venue */}
            <Modal show={showVenueModal} onHide={() => setShowVenueModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Venue Not Assigned</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The event venue is not assigned by the organizers.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowVenueModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No booked events found.</p>
        )}
      </div>


      <br/>

<div
style={{
  width: '90vw',
  height: '3px',
  backgroundColor: 'black', 
  margin: '0 auto',
}}
/>

      <h1>All Events</h1>

      {/* Search Input */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by event name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Theme Filter */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Filter by Theme:</h3>
        {uniqueThemes.map((theme, index) => (
          <label key={index} style={{ marginRight: '10px' }}>
            <input
              type="checkbox"
              checked={selectedThemes.includes(theme)}
              onChange={() => handleThemeChange(theme)}
            />
            {theme}
          </label>
        ))}
      </div>

      <div className="events-table">
        {filteredEvents.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Event Theme</th>
                <th>Event Description</th>
                <th>Max Capacity</th>
                <th>Current Capacity</th>
                <th>Ticket Price</th>
                <th>Event Date and Time</th>
                <th>Venue Name</th>
                {/*Google can directly search?*/}
                {/*
                <th>Latitude</th>
                <th>Longitude</th>
                */}
                <th>View Location</th>
                <th>Book the Event</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event, index) => (
                <tr key={index}>
                  <td>{event.event_name}</td>
                  <td>{event.event_theme}</td>
                  <td>{event.event_description}</td>
                  <td>{event.max_capacity}</td>
                  <td>{event.current_capacity}</td>
                  <td>₹{event.ticket_price}</td>
                  <td>{new Date(event.event_datetime).toLocaleString()}</td>
                  <td>{event.venue_name}</td>
                  {/*Not Needed*/}
                  {/*
                  <td>{event.latitude}</td>
                  <td>{event.longitude}</td>
                  */}
                  <td>
                                        {/*onClick={() => openGoogleMaps2(event.latitude, event.longitude)}*/}
                                        <button
        onClick={() => handleViewLocation(event.venue_name)}
        style={{
          backgroundColor: '#4CAF50',
          color: '#fff',
          padding: '5px 10px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        View Location
      </button>

            {/* Modal for unassigned venue */}
            <Modal show={showVenueModal} onHide={() => setShowVenueModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Venue Not Assigned</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The event venue is not assigned by the organizers.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowVenueModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
                  </td>
                  <td>
                  <div style={{ padding: '20px' }}>



{event.venue_name.toLowerCase() === 'unassigned' ? (
  // Display exclamation button and modal for unassigned venues
  <button
    style={{
      backgroundColor: 'red',
      color: '#fff',
      padding: '5px 10px',
      border: '2px solid black',
      borderRadius: '5px',
      cursor: 'not-allowed', // disable cursor
    }}
    disabled // Disable the button for unassigned venues
  >
    ⚠️ Venue Unassigned
  </button>
) : (
  // Display the booking button for assigned venues
  <button
    style={{
      backgroundColor: 'yellow',
      color: '#000',
      padding: '5px 10px',
      border: '2px solid black',
      borderRadius: '5px',
      cursor: 'pointer',
    }}
    onClick={() => handleShow(event.eventid)}  // Pass the event ID here
  >
    Book +1
  </button>
)}

<Modal show={show} onHide={handleClose}>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Payment</Modal.Title>
  </Modal.Header>
  <Modal.Body>Are you sure you want to proceed?</Modal.Body>
  <Modal.Footer>
    <Button variant="success" onClick={handleConfirmBooking}>
      Yes
    </Button>
    <Button variant="danger" onClick={handleClose}>
      Cancel
    </Button>
  </Modal.Footer>
</Modal>

    </div>


                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No events available.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;