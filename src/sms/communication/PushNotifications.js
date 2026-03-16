import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const PushNotifications = () => {
  const { 
    students,
    teachers,
    classes,
    sections,
    pushNotificationHistory,
    sendPushNotification
  } = useSchool();

  const [formData, setFormData] = useState({
    recipientType: 'All', // All, Students, Parents, Teachers, Staff, Specific Class
    targetClass: '',
    targetSection: '',
    title: '',
    message: '',
    notificationType: 'Info', // Info, Alert, Reminder, Update
    priority: 'Normal', // Low, Normal, High
    actionUrl: '',
    scheduleDate: '',
    scheduleTime: ''
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isScheduled, setIsScheduled] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getRecipientCount = () => {
    if (formData.recipientType === 'All') {
      return students.length + teachers.length;
    } else if (formData.recipientType === 'Students') {
      let count = students.length;
      if (formData.targetClass) {
        count = students.filter(s => s.class === formData.targetClass).length;
      }
      if (formData.targetSection) {
        count = students.filter(s => s.class === formData.targetClass && s.section === formData.targetSection).length;
      }
      return count;
    } else if (formData.recipientType === 'Teachers') {
      return teachers.length;
    }
    return 0;
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    if (formData.message.length > 200) {
      newErrors.message = 'Message cannot exceed 200 characters';
    }
    
    if (isScheduled) {
      if (!formData.scheduleDate) {
        newErrors.scheduleDate = 'Schedule date is required';
      }
      if (!formData.scheduleTime) {
        newErrors.scheduleTime = 'Schedule time is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = () => {
    if (validate()) {
      const notificationData = {
        recipientType: formData.recipientType,
        targetClass: formData.targetClass,
        targetSection: formData.targetSection,
        title: formData.title,
        message: formData.message,
        notificationType: formData.notificationType,
        priority: formData.priority,
        actionUrl: formData.actionUrl,
        scheduled: isScheduled,
        scheduleDate: isScheduled ? formData.scheduleDate : null,
        scheduleTime: isScheduled ? formData.scheduleTime : null,
        status: isScheduled ? 'Scheduled' : 'Sent',
        sentDate: isScheduled ? null : new Date().toISOString(),
        recipientCount: getRecipientCount()
      };

      sendPushNotification(notificationData);
      alert(`Push notification ${isScheduled ? 'scheduled' : 'sent'} successfully to ${getRecipientCount()} recipient(s)!`);
      
      // Reset form
      setFormData({
        recipientType: 'All',
        targetClass: '',
        targetSection: '',
        title: '',
        message: '',
        notificationType: 'Info',
        priority: 'Normal',
        actionUrl: '',
        scheduleDate: '',
        scheduleTime: ''
      });
      setIsScheduled(false);
    }
  };

  // Filter notification history
  let filteredNotifications = pushNotificationHistory.filter(notification =>
    notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterType !== 'All') {
    filteredNotifications = filteredNotifications.filter(n => n.notificationType === filterType);
  }

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Push Notifications</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/communication">Communication</Link></li>
              <li className="breadcrumb-item active">Push Notifications</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Send Push Notification</h5>
                  <form>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Recipient Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="recipientType"
                          value={formData.recipientType}
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
                      {formData.recipientType === 'Students' || formData.recipientType === 'Specific Class' ? (
                        <>
                          <div className="col-md-4">
                            <label className="form-label">Filter by Class</label>
                            <select
                              className="form-select"
                              name="targetClass"
                              value={formData.targetClass}
                              onChange={handleChange}
                            >
                              <option value="">All Classes</option>
                              {classes.map(cls => (
                                <option key={cls.id} value={cls.name}>{cls.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Filter by Section</label>
                            <select
                              className="form-select"
                              name="targetSection"
                              value={formData.targetSection}
                              onChange={handleChange}
                              disabled={!formData.targetClass}
                            >
                              <option value="">All Sections</option>
                              {sections.filter(s => s.className === formData.targetClass).map(section => (
                                <option key={section.id} value={section.name}>{section.name}</option>
                              ))}
                            </select>
                          </div>
                        </>
                      ) : null}
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Notification Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="notificationType"
                          value={formData.notificationType}
                          onChange={handleChange}
                        >
                          <option value="Info">Info</option>
                          <option value="Alert">Alert</option>
                          <option value="Reminder">Reminder</option>
                          <option value="Update">Update</option>
                        </select>
                      </div>
                      <div className="col-md-6">
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
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">
                          Title <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Enter notification title"
                          maxLength={100}
                        />
                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">
                          Message <span className="text-danger">*</span>
                          <span className="text-muted ms-2">({formData.message.length}/200 characters)</span>
                        </label>
                        <textarea
                          className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows="4"
                          placeholder="Enter notification message (max 200 characters)"
                          maxLength={200}
                        />
                        {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Action URL (Optional)</label>
                        <input
                          type="url"
                          className="form-control"
                          name="actionUrl"
                          value={formData.actionUrl}
                          onChange={handleChange}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={isScheduled}
                            onChange={(e) => setIsScheduled(e.target.checked)}
                            id="isScheduled"
                          />
                          <label className="form-check-label" htmlFor="isScheduled">
                            Schedule Notification
                          </label>
                        </div>
                      </div>
                    </div>

                    {isScheduled && (
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">
                            Schedule Date <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            className={`form-control ${errors.scheduleDate ? 'is-invalid' : ''}`}
                            name="scheduleDate"
                            value={formData.scheduleDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                          />
                          {errors.scheduleDate && <div className="invalid-feedback">{errors.scheduleDate}</div>}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            Schedule Time <span className="text-danger">*</span>
                          </label>
                          <input
                            type="time"
                            className={`form-control ${errors.scheduleTime ? 'is-invalid' : ''}`}
                            name="scheduleTime"
                            value={formData.scheduleTime}
                            onChange={handleChange}
                          />
                          {errors.scheduleTime && <div className="invalid-feedback">{errors.scheduleTime}</div>}
                        </div>
                      </div>
                    )}

                    <div className="alert alert-info">
                      <strong>Recipients:</strong> {getRecipientCount()} recipient(s) will receive this notification
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSend}
                      >
                        <i className="bi bi-bell"></i> {isScheduled ? 'Schedule' : 'Send'} Notification
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Notification History</h5>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by title, message..."
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
                        <option value="Info">Info</option>
                        <option value="Alert">Alert</option>
                        <option value="Reminder">Reminder</option>
                        <option value="Update">Update</option>
                      </select>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Date & Time</th>
                          <th>Type</th>
                          <th>Title</th>
                          <th>Recipients</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredNotifications.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center text-muted">
                              No notification history found
                            </td>
                          </tr>
                        ) : (
                          filteredNotifications.map((notification) => (
                            <tr key={notification.id}>
                              <td>
                                {notification.sentDate ? new Date(notification.sentDate).toLocaleString() : 
                                 notification.scheduleDate ? `Scheduled: ${new Date(notification.scheduleDate).toLocaleDateString()} ${notification.scheduleTime}` : '-'}
                              </td>
                              <td>
                                <span className={`badge ${
                                  notification.notificationType === 'Alert' ? 'bg-danger' :
                                  notification.notificationType === 'Reminder' ? 'bg-warning' :
                                  notification.notificationType === 'Update' ? 'bg-info' : 'bg-secondary'
                                }`}>
                                  {notification.notificationType}
                                </span>
                              </td>
                              <td>{notification.title}</td>
                              <td>{notification.recipientCount || 0} recipient(s)</td>
                              <td>
                                <span className={`badge ${
                                  notification.status === 'Sent' ? 'bg-success' :
                                  notification.status === 'Scheduled' ? 'bg-warning' :
                                  notification.status === 'Failed' ? 'bg-danger' : 'bg-secondary'
                                }`}>
                                  {notification.status}
                                </span>
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
};

export default PushNotifications;

