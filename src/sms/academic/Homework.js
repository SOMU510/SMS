import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const Homework = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { homeworks, classes, subjects, teachers, addHomework, updateHomework, deleteHomework } = useSchool();
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    title: '',
    className: '',
    subject: '',
    teacher: '',
    assignedDate: '',
    dueDate: '',
    description: '',
    instructions: '',
    maxMarks: '',
    attachments: [],
    status: 'Active'
  });
  const [errors, setErrors] = useState({});
  const [attachmentName, setAttachmentName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Load homework data if editing
  useEffect(() => {
    if (isEditMode) {
      const homework = homeworks.find(hw => hw.id === parseInt(id));
      if (homework) {
        setFormData({
          title: homework.title || '',
          className: homework.className || '',
          subject: homework.subject || '',
          teacher: homework.teacher || '',
          assignedDate: homework.assignedDate || '',
          dueDate: homework.dueDate || '',
          description: homework.description || '',
          instructions: homework.instructions || '',
          maxMarks: homework.maxMarks || '',
          attachments: homework.attachments || [],
          status: homework.status || 'Active'
        });
      }
    } else {
      // Set default assigned date to today
      setFormData(prev => ({
        ...prev,
        assignedDate: new Date().toISOString().split('T')[0]
      }));
    }
  }, [id, isEditMode, homeworks]);

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

  const handleAddAttachment = () => {
    if (attachmentName.trim()) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, { id: Date.now(), name: attachmentName.trim() }]
      }));
      setAttachmentName('');
    }
  };

  const handleRemoveAttachment = (attachmentId) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== attachmentId)
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Homework title is required';
    }
    
    if (!formData.className) {
      newErrors.className = 'Class is required';
    }

    if (!formData.subject) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.assignedDate) {
      newErrors.assignedDate = 'Assigned date is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (formData.assignedDate && formData.dueDate) {
      const assigned = new Date(formData.assignedDate);
      const due = new Date(formData.dueDate);
      
      if (due < assigned) {
        newErrors.dueDate = 'Due date must be after assigned date';
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isEditMode) {
        updateHomework(parseInt(id), formData);
        alert('Homework updated successfully!');
      } else {
        addHomework(formData);
        alert('Homework assigned successfully!');
      }
      navigate('/academic/homework');
    }
  };

  const handleDelete = (homeworkId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteHomework(homeworkId);
    }
  };

  // Filter homeworks for list view
  const filteredHomeworks = homeworks.filter(homework =>
    homework.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    homework.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    homework.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status badge
  const getStatusBadge = (homework) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(homework.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (homework.status === 'Completed') {
      return <span className="badge bg-success">Completed</span>;
    } else if (dueDate < today) {
      return <span className="badge bg-danger">Overdue</span>;
    } else if (homework.status === 'Active') {
      return <span className="badge bg-primary">Active</span>;
    } else {
      return <span className="badge bg-secondary">Inactive</span>;
    }
  };

  // If not in add/edit mode, show list view, otherwise show form
  if (!showForm) {
    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Homework</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">Homework</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Homework Assignments</h5>
                      <Link to="/academic/homework/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Assign New Homework
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Search homework..."
                          value={searchTerm} 
                          onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Class</th>
                            <th>Subject</th>
                            <th>Teacher</th>
                            <th>Assigned Date</th>
                            <th>Due Date</th>
                            <th>Max Marks</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredHomeworks.length === 0 ? (
                            <tr>
                              <td colSpan="9" className="text-center">
                                <p className="text-muted">No homework assignments found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredHomeworks.map((homework) => (
                              <tr key={homework.id}>
                                <td>
                                  <strong>{homework.title}</strong>
                                  {homework.description && (
                                    <>
                                      <br />
                                      <small className="text-muted">{homework.description.substring(0, 50)}...</small>
                                    </>
                                  )}
                                </td>
                                <td>{homework.className || '-'}</td>
                                <td>{homework.subject || '-'}</td>
                                <td>{homework.teacher || '-'}</td>
                                <td>{homework.assignedDate ? new Date(homework.assignedDate).toLocaleDateString() : '-'}</td>
                                <td>{homework.dueDate ? new Date(homework.dueDate).toLocaleDateString() : '-'}</td>
                                <td>{homework.maxMarks || '-'}</td>
                                <td>{getStatusBadge(homework)}</td>
                                <td>
                                  <Link 
                                    to={`/academic/homework/${homework.id}`} 
                                    className="btn btn-sm btn-primary me-1"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  <button 
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(homework.id, homework.title)}
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
          <h1>{isEditMode ? 'Edit Homework' : 'Assign Homework'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/academic/homework">Homework</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Assign'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Homework Assignment Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">
                          Homework Title <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g., Chapter 5 Exercises"
                        />
                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Class <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.className ? 'is-invalid' : ''}`}
                          name="className"
                          value={formData.className}
                          onChange={handleChange}
                        >
                          <option value="">Select Class</option>
                          {classes.map(cls => (
                            <option key={cls.id} value={cls.name}>
                              {cls.name}
                            </option>
                          ))}
                        </select>
                        {errors.className && <div className="invalid-feedback">{errors.className}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Subject <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.subject ? 'is-invalid' : ''}`}
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                        >
                          <option value="">Select Subject</option>
                          {subjects.map(subj => (
                            <option key={subj.id} value={subj.name}>
                              {subj.name}
                            </option>
                          ))}
                        </select>
                        {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Teacher</label>
                        <select
                          className="form-select"
                          name="teacher"
                          value={formData.teacher}
                          onChange={handleChange}
                        >
                          <option value="">Select Teacher</option>
                          {teachers.map(teacher => (
                            <option key={teacher.id} value={`${teacher.firstName} ${teacher.lastName}`}>
                              {teacher.firstName} {teacher.lastName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Assigned Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className={`form-control ${errors.assignedDate ? 'is-invalid' : ''}`}
                          name="assignedDate"
                          value={formData.assignedDate}
                          onChange={handleChange}
                        />
                        {errors.assignedDate && <div className="invalid-feedback">{errors.assignedDate}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Due Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
                          name="dueDate"
                          value={formData.dueDate}
                          onChange={handleChange}
                        />
                        {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Max Marks</label>
                        <input
                          type="number"
                          className="form-control"
                          name="maxMarks"
                          value={formData.maxMarks}
                          onChange={handleChange}
                          placeholder="e.g., 100"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">
                          Description <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Brief description of the homework assignment"
                        />
                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Instructions</label>
                        <textarea
                          className="form-control"
                          name="instructions"
                          value={formData.instructions}
                          onChange={handleChange}
                          rows="4"
                          placeholder="Detailed instructions for students (optional)"
                        />
                      </div>
                    </div>

                    {/* Attachments */}
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <h6 className="mb-3">Attachments/Resources</h6>
                        <div className="d-flex gap-2 mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter attachment name or file reference"
                            value={attachmentName}
                            onChange={(e) => setAttachmentName(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddAttachment();
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={handleAddAttachment}
                          >
                            <i className="bi bi-plus-circle"></i> Add
                          </button>
                        </div>
                        {formData.attachments.length > 0 && (
                          <ul className="list-group">
                            {formData.attachments.map((attachment) => (
                              <li key={attachment.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>
                                  <i className="bi bi-paperclip me-2"></i>
                                  {attachment.name}
                                </span>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleRemoveAttachment(attachment.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
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
                          <option value="Completed">Completed</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-end">
                      <button 
                        type="button" 
                        className="btn btn-secondary me-2" 
                        onClick={() => navigate('/academic/homework')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Assign'} Homework
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

export default Homework;

