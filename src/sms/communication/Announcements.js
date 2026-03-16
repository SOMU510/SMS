import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const Announcements = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { 
    announcements,
    classes,
    sections,
    students,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
  } = useSchool();
  
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    announcementType: 'General', // General, Academic, Event, Emergency, Holiday
    priority: 'Normal', // Low, Normal, High, Urgent
    targetAudience: 'All', // All, Students, Parents, Teachers, Staff, Specific Class
    targetClass: '',
    targetSection: '',
    publishDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    isActive: true,
    attachments: []
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Load announcement data if editing
  useEffect(() => {
    if (isEditMode) {
      const announcement = announcements.find(a => a.id === parseInt(id));
      if (announcement) {
        setFormData({
          title: announcement.title || '',
          content: announcement.content || '',
          announcementType: announcement.announcementType || 'General',
          priority: announcement.priority || 'Normal',
          targetAudience: announcement.targetAudience || 'All',
          targetClass: announcement.targetClass || '',
          targetSection: announcement.targetSection || '',
          publishDate: announcement.publishDate || new Date().toISOString().split('T')[0],
          expiryDate: announcement.expiryDate || '',
          isActive: announcement.isActive !== undefined ? announcement.isActive : true,
          attachments: announcement.attachments || []
        });
      }
    }
  }, [id, isEditMode, announcements]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'targetClass' && { targetSection: '' })
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
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.publishDate) {
      newErrors.publishDate = 'Publish date is required';
    }
    
    if (formData.targetAudience === 'Specific Class' && !formData.targetClass) {
      newErrors.targetClass = 'Target class is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isEditMode) {
        updateAnnouncement(parseInt(id), formData);
        alert('Announcement updated successfully!');
      } else {
        addAnnouncement(formData);
        alert('Announcement created successfully!');
      }
      navigate('/communication/announcements');
    }
  };

  const handleDelete = (announcementId, title) => {
    if (window.confirm(`Are you sure you want to delete announcement "${title}"?`)) {
      deleteAnnouncement(announcementId);
    }
  };

  // Filter announcements
  let filteredAnnouncements = announcements.filter(announcement =>
    announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterType !== 'All') {
    filteredAnnouncements = filteredAnnouncements.filter(a => a.announcementType === filterType);
  }

  if (filterPriority !== 'All') {
    filteredAnnouncements = filteredAnnouncements.filter(a => a.priority === filterPriority);
  }

  if (filterStatus !== 'All') {
    const today = new Date().toISOString().split('T')[0];
    if (filterStatus === 'Active') {
      filteredAnnouncements = filteredAnnouncements.filter(a => 
        a.isActive && (!a.expiryDate || a.expiryDate >= today)
      );
    } else if (filterStatus === 'Expired') {
      filteredAnnouncements = filteredAnnouncements.filter(a => 
        a.expiryDate && a.expiryDate < today
      );
    }
  }

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'Urgent': return 'bg-danger';
      case 'High': return 'bg-warning';
      case 'Normal': return 'bg-info';
      case 'Low': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  };

  const getTypeBadge = (type) => {
    switch(type) {
      case 'Emergency': return 'bg-danger';
      case 'Event': return 'bg-success';
      case 'Holiday': return 'bg-primary';
      case 'Academic': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  // Filter sections based on selected class
  const selectedClassObj = classes.find(c => c.name === formData.targetClass);
  const availableSections = formData.targetClass && selectedClassObj
    ? sections.filter(s => s.className === formData.targetClass)
    : [];

  // If not in add/edit mode, show list view
  if (!showForm) {
    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Announcements</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/communication">Communication</Link></li>
                <li className="breadcrumb-item active">Announcements</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Announcements</h5>
                      <Link to="/communication/announcements/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Create Announcement
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by title or content..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-select"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                        >
                          <option value="All">All Types</option>
                          <option value="General">General</option>
                          <option value="Academic">Academic</option>
                          <option value="Event">Event</option>
                          <option value="Emergency">Emergency</option>
                          <option value="Holiday">Holiday</option>
                        </select>
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-select"
                          value={filterPriority}
                          onChange={(e) => setFilterPriority(e.target.value)}
                        >
                          <option value="All">All Priorities</option>
                          <option value="Urgent">Urgent</option>
                          <option value="High">High</option>
                          <option value="Normal">Normal</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-select"
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                        >
                          <option value="All">All Status</option>
                          <option value="Active">Active</option>
                          <option value="Expired">Expired</option>
                        </select>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Priority</th>
                            <th>Target Audience</th>
                            <th>Publish Date</th>
                            <th>Expiry Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAnnouncements.length === 0 ? (
                            <tr>
                              <td colSpan="8" className="text-center">
                                <p className="text-muted">No announcements found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredAnnouncements.map((announcement) => {
                              const today = new Date().toISOString().split('T')[0];
                              const isExpired = announcement.expiryDate && announcement.expiryDate < today;
                              return (
                                <tr key={announcement.id}>
                                  <td><strong>{announcement.title}</strong></td>
                                  <td>
                                    <span className={`badge ${getTypeBadge(announcement.announcementType)}`}>
                                      {announcement.announcementType}
                                    </span>
                                  </td>
                                  <td>
                                    <span className={`badge ${getPriorityBadge(announcement.priority)}`}>
                                      {announcement.priority}
                                    </span>
                                  </td>
                                  <td>
                                    {announcement.targetAudience}
                                    {announcement.targetClass && ` - ${announcement.targetClass}`}
                                    {announcement.targetSection && ` ${announcement.targetSection}`}
                                  </td>
                                  <td>{announcement.publishDate ? new Date(announcement.publishDate).toLocaleDateString() : '-'}</td>
                                  <td>{announcement.expiryDate ? new Date(announcement.expiryDate).toLocaleDateString() : 'No Expiry'}</td>
                                  <td>
                                    {isExpired ? (
                                      <span className="badge bg-secondary">Expired</span>
                                    ) : announcement.isActive ? (
                                      <span className="badge bg-success">Active</span>
                                    ) : (
                                      <span className="badge bg-secondary">Inactive</span>
                                    )}
                                  </td>
                                  <td>
                                    <Link
                                      to={`/communication/announcements/${announcement.id}`}
                                      className="btn btn-sm btn-primary me-1"
                                      title="Edit"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </Link>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleDelete(announcement.id, announcement.title)}
                                      title="Delete"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
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

  // Form view
  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>{isEditMode ? 'Edit Announcement' : 'Create Announcement'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/communication/announcements">Announcements</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Create'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Announcement Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-8">
                        <label className="form-label">
                          Title <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Enter announcement title"
                        />
                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Announcement Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="announcementType"
                          value={formData.announcementType}
                          onChange={handleChange}
                        >
                          <option value="General">General</option>
                          <option value="Academic">Academic</option>
                          <option value="Event">Event</option>
                          <option value="Emergency">Emergency</option>
                          <option value="Holiday">Holiday</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">
                          Content <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                          name="content"
                          value={formData.content}
                          onChange={handleChange}
                          rows="6"
                          placeholder="Enter announcement content"
                        />
                        {errors.content && <div className="invalid-feedback">{errors.content}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-3">
                        <label className="form-label">
                          Priority <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="priority"
                          value={formData.priority}
                          onChange={handleChange}
                        >
                          <option value="Low">Low</option>
                          <option value="Normal">Normal</option>
                          <option value="High">High</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">
                          Target Audience <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="targetAudience"
                          value={formData.targetAudience}
                          onChange={handleChange}
                        >
                          <option value="All">All</option>
                          <option value="Students">Students</option>
                          <option value="Parents">Parents</option>
                          <option value="Teachers">Teachers</option>
                          <option value="Staff">Staff</option>
                          <option value="Specific Class">Specific Class</option>
                        </select>
                      </div>
                      {formData.targetAudience === 'Specific Class' && (
                        <>
                          <div className="col-md-3">
                            <label className="form-label">
                              Class <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`form-select ${errors.targetClass ? 'is-invalid' : ''}`}
                              name="targetClass"
                              value={formData.targetClass}
                              onChange={handleChange}
                            >
                              <option value="">Select Class</option>
                              {classes.map(cls => (
                                <option key={cls.id} value={cls.name}>{cls.name}</option>
                              ))}
                            </select>
                            {errors.targetClass && <div className="invalid-feedback">{errors.targetClass}</div>}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Section (Optional)</label>
                            <select
                              className="form-select"
                              name="targetSection"
                              value={formData.targetSection}
                              onChange={handleChange}
                              disabled={!formData.targetClass}
                            >
                              <option value="">All Sections</option>
                              {availableSections.map(section => (
                                <option key={section.id} value={section.name}>{section.name}</option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Publish Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className={`form-control ${errors.publishDate ? 'is-invalid' : ''}`}
                          name="publishDate"
                          value={formData.publishDate}
                          onChange={handleChange}
                        />
                        {errors.publishDate && <div className="invalid-feedback">{errors.publishDate}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Expiry Date (Optional)</label>
                        <input
                          type="date"
                          className="form-control"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          min={formData.publishDate}
                        />
                      </div>
                      <div className="col-md-4">
                        <div className="form-check mt-4">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            id="isActive"
                          />
                          <label className="form-check-label" htmlFor="isActive">
                            Active
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate('/communication/announcements')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Create'} Announcement
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

export default Announcements;

