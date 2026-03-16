import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const ParentTeacherMessaging = () => {
  const { 
    students,
    teachers,
    parentTeacherMessages,
    addParentTeacherMessage
  } = useSchool();

  const [formData, setFormData] = useState({
    senderType: 'Teacher', // Teacher, Parent
    senderId: '',
    recipientType: 'Parent', // Parent, Teacher
    recipientId: '',
    studentId: '',
    subject: '',
    message: '',
    priority: 'Normal'
  });
  const [errors, setErrors] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSender, setFilterSender] = useState('All');
  const [filterStudent, setFilterStudent] = useState('All');

  // Get current user (assuming teacher for now)
  const currentTeacher = teachers[0]; // In real app, get from auth context

  useEffect(() => {
    if (currentTeacher && formData.senderType === 'Teacher') {
      setFormData(prev => ({
        ...prev,
        senderId: currentTeacher.id
      }));
    }
  }, [currentTeacher, formData.senderType]);

  useEffect(() => {
    if (formData.studentId) {
      const student = students.find(s => s.id === parseInt(formData.studentId));
      setSelectedStudent(student);
      if (student && formData.recipientType === 'Parent') {
        // Find parent/guardian
        setFormData(prev => ({
          ...prev,
          recipientId: student.parentId || student.guardianId || ''
        }));
      }
    }
  }, [formData.studentId, formData.recipientType, students]);

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

  const validate = () => {
    const newErrors = {};
    
    if (!formData.studentId) {
      newErrors.studentId = 'Student is required';
    }
    
    if (!formData.recipientId) {
      newErrors.recipientId = 'Recipient is required';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = () => {
    if (validate()) {
      const student = students.find(s => s.id === parseInt(formData.studentId));
      const messageData = {
        senderType: formData.senderType,
        senderId: formData.senderId,
        senderName: formData.senderType === 'Teacher' 
          ? `${currentTeacher?.firstName} ${currentTeacher?.lastName}`
          : 'Parent',
        recipientType: formData.recipientType,
        recipientId: formData.recipientId,
        recipientName: formData.recipientType === 'Parent'
          ? `${student?.parentName || 'Parent'}`
          : 'Teacher',
        studentId: parseInt(formData.studentId),
        studentName: `${student?.firstName} ${student?.lastName}`,
        subject: formData.subject,
        message: formData.message,
        priority: formData.priority,
        status: 'Unread',
        sentDate: new Date().toISOString()
      };

      addParentTeacherMessage(messageData);
      alert('Message sent successfully!');
      
      // Reset form
      setFormData({
        senderType: 'Teacher',
        senderId: currentTeacher?.id || '',
        recipientType: 'Parent',
        recipientId: '',
        studentId: '',
        subject: '',
        message: '',
        priority: 'Normal'
      });
      setSelectedStudent(null);
    }
  };

  // Filter messages
  let filteredMessages = parentTeacherMessages.filter(msg =>
    msg.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterSender !== 'All') {
    filteredMessages = filteredMessages.filter(m => m.senderType === filterSender);
  }

  if (filterStudent !== 'All') {
    filteredMessages = filteredMessages.filter(m => m.studentId === parseInt(filterStudent));
  }

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Parent-Teacher Messaging</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/communication">Communication</Link></li>
              <li className="breadcrumb-item active">Parent-Teacher Messaging</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Send Message</h5>
                  <form>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Student <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.studentId ? 'is-invalid' : ''}`}
                          name="studentId"
                          value={formData.studentId}
                          onChange={handleChange}
                        >
                          <option value="">Select Student</option>
                          {students.map(student => (
                            <option key={student.id} value={student.id}>
                              {student.admissionNo} - {student.firstName} {student.lastName} ({student.class})
                            </option>
                          ))}
                        </select>
                        {errors.studentId && <div className="invalid-feedback">{errors.studentId}</div>}
                      </div>
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
                          <option value="Parent">Parent</option>
                          <option value="Teacher">Teacher</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Priority
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
                    </div>

                    {selectedStudent && (
                      <div className="alert alert-info">
                        <strong>Student:</strong> {selectedStudent.firstName} {selectedStudent.lastName} ({selectedStudent.class} {selectedStudent.section})<br />
                        <strong>Parent:</strong> {selectedStudent.parentName || 'Not Available'}
                      </div>
                    )}

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">
                          Subject <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Enter message subject"
                        />
                        {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">
                          Message <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows="6"
                          placeholder="Enter your message"
                        />
                        {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSend}
                      >
                        <i className="bi bi-send"></i> Send Message
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
                  <h5 className="card-title">Message History</h5>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by subject, message, student..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-select"
                        value={filterSender}
                        onChange={(e) => setFilterSender(e.target.value)}
                      >
                        <option value="All">All Senders</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Parent">Parent</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-select"
                        value={filterStudent}
                        onChange={(e) => setFilterStudent(e.target.value)}
                      >
                        <option value="All">All Students</option>
                        {students.map(student => (
                          <option key={student.id} value={student.id}>
                            {student.firstName} {student.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Date & Time</th>
                          <th>Student</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Subject</th>
                          <th>Priority</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMessages.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center text-muted">
                              No messages found
                            </td>
                          </tr>
                        ) : (
                          filteredMessages.map((message) => (
                            <tr key={message.id}>
                              <td>{message.sentDate ? new Date(message.sentDate).toLocaleString() : '-'}</td>
                              <td>{message.studentName}</td>
                              <td>
                                <span className={`badge ${message.senderType === 'Teacher' ? 'bg-info' : 'bg-primary'}`}>
                                  {message.senderName}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${message.recipientType === 'Teacher' ? 'bg-info' : 'bg-primary'}`}>
                                  {message.recipientName}
                                </span>
                              </td>
                              <td>{message.subject}</td>
                              <td>
                                <span className={`badge ${
                                  message.priority === 'Urgent' ? 'bg-danger' :
                                  message.priority === 'High' ? 'bg-warning' :
                                  message.priority === 'Normal' ? 'bg-info' : 'bg-secondary'
                                }`}>
                                  {message.priority}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${message.status === 'Unread' ? 'bg-warning' : 'bg-success'}`}>
                                  {message.status}
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

export default ParentTeacherMessaging;

