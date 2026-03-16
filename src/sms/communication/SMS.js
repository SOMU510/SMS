import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const SMS = () => {
  const { 
    students,
    teachers,
    classes,
    sections,
    smsHistory,
    sendSMS
  } = useSchool();

  const [formData, setFormData] = useState({
    recipientType: 'Students', // Students, Parents, Teachers, Staff, Custom
    targetClass: '',
    targetSection: '',
    selectedRecipients: [],
    message: '',
    template: '',
    scheduleDate: '',
    scheduleTime: ''
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRecipient, setFilterRecipient] = useState('All');
  const [isScheduled, setIsScheduled] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'targetClass' && { targetSection: '', selectedRecipients: [] })
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRecipientSelect = (recipientId, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        selectedRecipients: [...prev.selectedRecipients, recipientId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedRecipients: prev.selectedRecipients.filter(id => id !== recipientId)
      }));
    }
  };

  const handleSelectAll = (checked) => {
    const availableRecipients = getAvailableRecipients();
    if (checked) {
      setFormData(prev => ({
        ...prev,
        selectedRecipients: availableRecipients.map(r => r.id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedRecipients: []
      }));
    }
  };

  const getAvailableRecipients = () => {
    if (formData.recipientType === 'Students') {
      let filtered = students;
      if (formData.targetClass) {
        filtered = filtered.filter(s => s.class === formData.targetClass);
      }
      if (formData.targetSection) {
        filtered = filtered.filter(s => s.section === formData.targetSection);
      }
      return filtered;
    } else if (formData.recipientType === 'Teachers') {
      return teachers;
    }
    return [];
  };

  const validate = () => {
    const newErrors = {};
    
    if (formData.recipientType === 'Custom' && formData.selectedRecipients.length === 0) {
      newErrors.recipients = 'Please select at least one recipient';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    if (formData.message.length > 160) {
      newErrors.message = 'Message cannot exceed 160 characters';
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
      const recipients = formData.recipientType === 'Custom' 
        ? formData.selectedRecipients 
        : getAvailableRecipients().map(r => r.id);

      const smsData = {
        recipientType: formData.recipientType,
        recipients: recipients,
        message: formData.message,
        scheduled: isScheduled,
        scheduleDate: isScheduled ? formData.scheduleDate : null,
        scheduleTime: isScheduled ? formData.scheduleTime : null,
        status: isScheduled ? 'Scheduled' : 'Sent',
        sentDate: isScheduled ? null : new Date().toISOString()
      };

      sendSMS(smsData);
      alert(`SMS ${isScheduled ? 'scheduled' : 'sent'} successfully to ${recipients.length} recipient(s)!`);
      
      // Reset form
      setFormData({
        recipientType: 'Students',
        targetClass: '',
        targetSection: '',
        selectedRecipients: [],
        message: '',
        template: '',
        scheduleDate: '',
        scheduleTime: ''
      });
      setIsScheduled(false);
    }
  };

  // Filter SMS history
  let filteredSMS = smsHistory.filter(sms =>
    sms.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sms.recipientType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterRecipient !== 'All') {
    filteredSMS = filteredSMS.filter(s => s.recipientType === filterRecipient);
  }

  const availableRecipients = getAvailableRecipients();

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>SMS Management</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/communication">Communication</Link></li>
              <li className="breadcrumb-item active">SMS</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Send SMS</h5>
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
                          <option value="Students">Students</option>
                          <option value="Parents">Parents</option>
                          <option value="Teachers">Teachers</option>
                          <option value="Staff">Staff</option>
                          <option value="Custom">Custom Selection</option>
                        </select>
                      </div>
                      {formData.recipientType === 'Students' && (
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
                      )}
                    </div>

                    {formData.recipientType === 'Custom' && (
                      <div className="row mb-3">
                        <div className="col-md-12">
                          <div className="card">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6>Select Recipients</h6>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={formData.selectedRecipients.length === availableRecipients.length && availableRecipients.length > 0}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    id="selectAll"
                                  />
                                  <label className="form-check-label" htmlFor="selectAll">
                                    Select All ({availableRecipients.length})
                                  </label>
                                </div>
                              </div>
                              <div className="table-responsive" style={{ maxHeight: '300px' }}>
                                <table className="table table-sm">
                                  <thead>
                                    <tr>
                                      <th>Select</th>
                                      <th>Name</th>
                                      <th>Phone</th>
                                      {formData.recipientType === 'Students' && <th>Class</th>}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {availableRecipients.map(recipient => (
                                      <tr key={recipient.id}>
                                        <td>
                                          <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={formData.selectedRecipients.includes(recipient.id)}
                                            onChange={(e) => handleRecipientSelect(recipient.id, e.target.checked)}
                                          />
                                        </td>
                                        <td>{recipient.firstName} {recipient.lastName}</td>
                                        <td>{recipient.phone || recipient.mobile || '-'}</td>
                                        {formData.recipientType === 'Students' && <td>{recipient.class}</td>}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              {errors.recipients && <div className="text-danger">{errors.recipients}</div>}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">
                          Message <span className="text-danger">*</span>
                          <span className="text-muted ms-2">({formData.message.length}/160 characters)</span>
                        </label>
                        <textarea
                          className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows="4"
                          placeholder="Enter your message (max 160 characters)"
                          maxLength={160}
                        />
                        {errors.message && <div className="invalid-feedback">{errors.message}</div>}
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
                            Schedule SMS
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
                      <strong>Recipients:</strong> {
                        formData.recipientType === 'Custom' 
                          ? formData.selectedRecipients.length 
                          : availableRecipients.length
                      } recipient(s) will receive this SMS
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSend}
                      >
                        <i className="bi bi-send"></i> {isScheduled ? 'Schedule' : 'Send'} SMS
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
                  <h5 className="card-title">SMS History</h5>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by message, recipient type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-select"
                        value={filterRecipient}
                        onChange={(e) => setFilterRecipient(e.target.value)}
                      >
                        <option value="All">All Recipients</option>
                        <option value="Students">Students</option>
                        <option value="Parents">Parents</option>
                        <option value="Teachers">Teachers</option>
                        <option value="Staff">Staff</option>
                      </select>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Date & Time</th>
                          <th>Recipient Type</th>
                          <th>Recipients</th>
                          <th>Message</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSMS.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center text-muted">
                              No SMS history found
                            </td>
                          </tr>
                        ) : (
                          filteredSMS.map((sms) => (
                            <tr key={sms.id}>
                              <td>
                                {sms.sentDate ? new Date(sms.sentDate).toLocaleString() : 
                                 sms.scheduleDate ? `Scheduled: ${new Date(sms.scheduleDate).toLocaleDateString()} ${sms.scheduleTime}` : '-'}
                              </td>
                              <td>{sms.recipientType}</td>
                              <td>{sms.recipients?.length || 0} recipient(s)</td>
                              <td>{sms.message}</td>
                              <td>
                                <span className={`badge ${
                                  sms.status === 'Sent' ? 'bg-success' :
                                  sms.status === 'Scheduled' ? 'bg-warning' :
                                  sms.status === 'Failed' ? 'bg-danger' : 'bg-secondary'
                                }`}>
                                  {sms.status}
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

export default SMS;

