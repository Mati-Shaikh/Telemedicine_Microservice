import React, { useState } from 'react';


const initialAppointments = [
  { id: 1, patientName: 'John Doe', time: '10:00 AM', date: '2024-11-15', type: 'Consultation' },
  { id: 2, patientName: 'Jane Smith', time: '12:00 PM', date: '2024-11-15', type: 'Follow-up' },
];

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    time: '',
    date: '',
    type: '',
  });

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment({ ...newAppointment, [name]: value });
  };

  
  const addAppointment = (e) => {
    e.preventDefault();
    const newId = appointments.length ? appointments[appointments.length - 1].id + 1 : 1;
    const appointmentToAdd = { ...newAppointment, id: newId };
    setAppointments([...appointments, appointmentToAdd]);
    setNewAppointment({ patientName: '', time: '', date: '', type: '' }); 
  };

  return (
    <div style={styles.container}>
      {/* Appointments List */}
      <div style={styles.appointmentsSection}>
        <h2 style={styles.subheading}>Upcoming Appointments</h2>
        <div style={styles.appointmentsBox}>
          {appointments.length ? (
            appointments.map((appointment) => (
              <div key={appointment.id} style={styles.appointmentCard}>
                <h3 style={styles.patientName}>Patient: {appointment.patientName}</h3>
                <p style={styles.appointmentDetail}>Date: {appointment.date}</p>
                <p style={styles.appointmentDetail}>Time: {appointment.time}</p>
                <p style={styles.appointmentDetail}>Type: {appointment.type}</p>
              </div>
            ))
          ) : (
            <p>No appointments found.</p>
          )}
        </div>
      </div>

      {/* Add New Appointment Form */}
      <div style={styles.addAppointmentForm}>
        <h2 style={styles.subheading}>Add New Appointment</h2>
        <form onSubmit={addAppointment} style={styles.form}>
          <label style={styles.label}>
            Patient Name:
            <input
              type="text"
              name="patientName"
              value={newAppointment.patientName}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Date:
            <input
              type="date"
              name="date"
              value={newAppointment.date}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Time:
            <input
              type="time"
              name="time"
              value={newAppointment.time}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Type of Appointment:
            <input
              type="text"
              name="type"
              value={newAppointment.type}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </label>
          <button type="submit" style={styles.button}>Add Appointment</button>
        </form>
      </div>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f6f9',
    maxHeight: '100vh',
    overflowY: 'auto',
  },
  subheading: {
    fontSize: '24px',
    marginBottom: '15px',
    color: '#34495e',
    letterSpacing: '1px',
  },
  appointmentsSection: {
    marginBottom: '40px',
  },
  appointmentsBox: {
    backgroundColor: '#e1f5fe',  
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #81d4fa',
  },
  appointmentCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  patientName: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#34495e',
    marginBottom: '10px',
  },
  appointmentDetail: {
    fontSize: '16px',
    color: '#7f8c8d',
    marginBottom: '8px',
  },
  addAppointmentForm: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '20px',
    fontSize: '18px',
    color: '#34495e',
  },
  input: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #bdc3c7',
    width: '100%',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  inputFocus: {
    borderColor: '#3498db',
  },
  button: {
    padding: '14px 25px',
    borderRadius: '6px',
    backgroundColor: '#3498db',
    color: '#fff',
    fontSize: '18px',
    border: 'none',
    cursor: 'pointer',
    alignSelf: 'flex-start',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#2980b9',
  },
};

export default DoctorAppointments;
