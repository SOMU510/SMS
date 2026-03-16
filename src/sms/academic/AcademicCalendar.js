import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const AcademicCalendar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { academicCalendars, academicYears, addAcademicCalendar, updateAcademicCalendar, deleteAcademicCalendar } = useSchool();
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    title: '',
    academicYear: '',
    eventType: 'Holiday',
    startDate: '',
    endDate: '',
    description: '',
    location: '',
    category: 'General',
    isHoliday: false,
    isExam: false,
    isImportant: false,
    status: 'Active'
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Load calendar event data if editing
  useEffect(() => {
    if (isEditMode) {
      const calendarEvent = academicCalendars.find(cal => cal.id === parseInt(id));
      if (calendarEvent) {
        setFormData({
          title: calendarEvent.title || '',
          academicYear: calendarEvent.academicYear || '',
          eventType: calendarEvent.eventType || 'Holiday',
          startDate: calendarEvent.startDate || '',
          endDate: calendarEvent.endDate || '',
          description: calendarEvent.description || '',
          location: calendarEvent.location || '',
          category: calendarEvent.category || 'General',
          isHoliday: calendarEvent.isHoliday || false,
          isExam: calendarEvent.isExam || false,
          isImportant: calendarEvent.isImportant || false,
          status: calendarEvent.status || 'Active'
        });
      }
    }
  }, [id, isEditMode, academicCalendars]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }
    
    if (!formData.academicYear) {
      newErrors.academicYear = 'Academic year is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (formData.endDate && formData.startDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end < start) {
        newErrors.endDate = 'End date must be after or equal to start date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isEditMode) {
        updateAcademicCalendar(parseInt(id), formData);
        alert('Calendar event updated successfully!');
      } else {
        addAcademicCalendar(formData);
        alert('Calendar event added successfully!');
      }
      navigate('/academic/calendar');
    }
  };

  const handleDelete = (eventId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteAcademicCalendar(eventId);
    }
  };

  // Filter calendar events for list view
  let filteredCalendars = academicCalendars.filter(cal =>
    cal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cal.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cal.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply type filter
  if (filterType !== 'All') {
    filteredCalendars = filteredCalendars.filter(cal => cal.eventType === filterType);
  }

  // Get event type badge color
  const getEventTypeBadge = (eventType) => {
    const badges = {
      'Holiday': 'bg-warning',
      'Exam': 'bg-danger',
      'Event': 'bg-info',
      'Meeting': 'bg-primary',
      'Deadline': 'bg-secondary',
      'Other': 'bg-dark'
    };
    return badges[eventType] || 'bg-secondary';
  };

  // Get status badge
  const getStatusBadge = (event) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(event.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = event.endDate ? new Date(event.endDate) : null;
    if (endDate) endDate.setHours(0, 0, 0, 0);

    if (event.status === 'Cancelled') {
      return <span className="badge bg-secondary">Cancelled</span>;
    } else if (endDate && endDate < today) {
      return <span className="badge bg-dark">Past</span>;
    } else if (startDate <= today && (!endDate || endDate >= today)) {
      return <span className="badge bg-success">Ongoing</span>;
    } else if (startDate > today) {
      return <span className="badge bg-primary">Upcoming</span>;
    } else {
      return <span className="badge bg-secondary">Active</span>;
    }
  };

  // If not in add/edit mode, show list view, otherwise show form
  if (!showForm) {
    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Academic Calendar</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">Academic Calendar</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Calendar Events</h5>
                      <Link to="/academic/calendar/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Add New Event
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Search events..."
                          value={searchTerm} 
                          onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-select"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                        >
                          <option value="All">All Types</option>
                          <option value="Holiday">Holiday</option>
                          <option value="Exam">Exam</option>
                          <option value="Event">Event</option>
                          <option value="Meeting">Meeting</option>
                          <option value="Deadline">Deadline</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Academic Year</th>
                            <th>Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Category</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCalendars.length === 0 ? (
                            <tr>
                              <td colSpan="9" className="text-center">
                                <p className="text-muted">No calendar events found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredCalendars.map((event) => (
                              <tr key={event.id}>
                                <td>
                                  <strong>{event.title}</strong>
                                  {event.isImportant && (
                                    <span className="badge bg-danger ms-2">Important</span>
                                  )}
                                  {event.description && (
                                    <>
                                      <br />
                                      <small className="text-muted">{event.description.substring(0, 50)}...</small>
                                    </>
                                  )}
                                </td>
                                <td>{event.academicYear || '-'}</td>
                                <td>
                                  <span className={`badge ${getEventTypeBadge(event.eventType)}`}>
                                    {event.eventType}
                                  </span>
                                </td>
                                <td>{event.startDate ? new Date(event.startDate).toLocaleDateString() : '-'}</td>
                                <td>{event.endDate ? new Date(event.endDate).toLocaleDateString() : '-'}</td>
                                <td>{event.category || '-'}</td>
                                <td>{event.location || '-'}</td>
                                <td>{getStatusBadge(event)}</td>
                                <td>
                                  <Link 
                                    to={`/academic/calendar/${event.id}`} 
                                    className="btn btn-sm btn-primary me-1"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  <button 
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(event.id, event.title)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  // Form view (for both add and edit)
  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>{isEditMode ? 'Edit Calendar Event' : 'Add Calendar Event'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/academic/calendar">Academic Calendar</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Add'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Calendar Event Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">
                          Event Title <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g., Annual Day Celebration, Mid-Term Exams"
                        />
                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Academic Year <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.academicYear ? 'is-invalid' : ''}`}
                          name="academicYear"
                          value={formData.academicYear}
                          onChange={handleChange}
                        >
                          <option value="">Select Academic Year</option>
                          {academicYears.map(year => (
                            <option key={year.id} value={year.name}>
                              {year.name}
                            </option>
                          ))}
                        </select>
                        {errors.academicYear && <div className="invalid-feedback">{errors.academicYear}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Event Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleChange}
                        >
                          <option value="Holiday">Holiday</option>
                          <option value="Exam">Exam</option>
                          <option value="Event">Event</option>
                          <option value="Meeting">Meeting</option>
                          <option value="Deadline">Deadline</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Start Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                        />
                        {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">End Date</label>
                        <input
                          type="date"
                          className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                        />
                        {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
                        <small className="form-text text-muted">Leave empty for single-day events</small>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Category</label>
                        <select
                          className="form-select"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                        >
                          <option value="General">General</option>
                          <option value="Academic">Academic</option>
                          <option value="Cultural">Cultural</option>
                          <option value="Sports">Sports</option>
                          <option value="Administrative">Administrative</option>
                          <option value="Parent-Teacher">Parent-Teacher</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Enter event description and details"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Location/Venue</label>
                        <input
                          type="text"
                          className="form-control"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g., Main Auditorium, School Ground, Online"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <h6 className="mb-3">Event Options</h6>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="isHoliday"
                            checked={formData.isHoliday}
                            onChange={handleChange}
                            id="isHoliday"
                          />
                          <label className="form-check-label" htmlFor="isHoliday">
                            Mark as Holiday (No classes)
                          </label>
                        </div>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="isExam"
                            checked={formData.isExam}
                            onChange={handleChange}
                            id="isExam"
                          />
                          <label className="form-check-label" htmlFor="isExam">
                            Mark as Exam Period
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="isImportant"
                            checked={formData.isImportant}
                            onChange={handleChange}
                            id="isImportant"
                          />
                          <label className="form-check-label" htmlFor="isImportant">
                            Mark as Important Event
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="Active">Active</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Postponed">Postponed</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-end">
                      <button 
                        type="button" 
                        className="btn btn-secondary me-2" 
                        onClick={() => navigate('/academic/calendar')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Save'} Event
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AcademicCalendar;

