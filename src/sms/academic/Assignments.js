import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const Assignments = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { assignments, classes, subjects, teachers, addAssignment, updateAssignment, deleteAssignment } = useSchool();
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
    submissionType: 'Individual',
    description: '',
    instructions: '',
    maxMarks: '',
    weightage: '',
    attachments: [],
    rubric: '',
    status: 'Active'
  });
  const [errors, setErrors] = useState({});
  const [attachmentName, setAttachmentName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Load assignment data if editing
  useEffect(() => {
    if (isEditMode) {
      const assignment = assignments.find(ass => ass.id === parseInt(id));
      if (assignment) {
        setFormData({
          title: assignment.title || '',
          className: assignment.className || '',
          subject: assignment.subject || '',
          teacher: assignment.teacher || '',
          assignedDate: assignment.assignedDate || '',
          dueDate: assignment.dueDate || '',
          submissionType: assignment.submissionType || 'Individual',
          description: assignment.description || '',
          instructions: assignment.instructions || '',
          maxMarks: assignment.maxMarks || '',
          weightage: assignment.weightage || '',
          attachments: assignment.attachments || [],
          rubric: assignment.rubric || '',
          status: assignment.status || 'Active'
        });
      }
    } else {
      // Set default assigned date to today
      setFormData(prev => ({
        ...prev,
        assignedDate: new Date().toISOString().split('T')[0]
      }));
    }
  }, [id, isEditMode, assignments]);

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
      newErrors.title = 'Assignment title is required';
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

    if (formData.maxMarks && (isNaN(formData.maxMarks) || formData.maxMarks < 0)) {
      newErrors.maxMarks = 'Max marks must be a valid positive number';
    }

    if (formData.weightage && (isNaN(formData.weightage) || formData.weightage < 0 || formData.weightage > 100)) {
      newErrors.weightage = 'Weightage must be between 0 and 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isEditMode) {
        updateAssignment(parseInt(id), formData);
        alert('Assignment updated successfully!');
      } else {
        addAssignment(formData);
        alert('Assignment created successfully!');
      }
      navigate('/academic/assignments');
    }
  };

  const handleDelete = (assignmentId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteAssignment(assignmentId);
    }
  };

  // Filter assignments for list view
  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status badge
  const getStatusBadge = (assignment) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(assignment.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (assignment.status === 'Completed') {
      return <span className="badge bg-success">Completed</span>;
    } else if (dueDate < today) {
      return <span className="badge bg-danger">Overdue</span>;
    } else if (assignment.status === 'Active') {
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
            <h1>Assignments</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">Assignments</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Assignments</h5>
                      <Link to="/academic/assignments/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Create New Assignment
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Search assignments..."
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
                            <th>Type</th>
                            <th>Max Marks</th>
                            <th>Weightage</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAssignments.length === 0 ? (
                            <tr>
                              <td colSpan="11" className="text-center">
                                <p className="text-muted">No assignments found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredAssignments.map((assignment) => (
                              <tr key={assignment.id}>
                                <td>
                                  <strong>{assignment.title}</strong>
                                  {assignment.description && (
                                    <>
                                      <br />
                                      <small className="text-muted">{assignment.description.substring(0, 50)}...</small>
                                    </>
                                  )}
                                </td>
                                <td>{assignment.className || '-'}</td>
                                <td>{assignment.subject || '-'}</td>
                                <td>{assignment.teacher || '-'}</td>
                                <td>{assignment.assignedDate ? new Date(assignment.assignedDate).toLocaleDateString() : '-'}</td>
                                <td>{assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : '-'}</td>
                                <td>
                                  <span className="badge bg-info">
                                    {assignment.submissionType || 'Individual'}
                                  </span>
                                </td>
                                <td>{assignment.maxMarks || '-'}</td>
                                <td>{assignment.weightage ? `${assignment.weightage}%` : '-'}</td>
                                <td>{getStatusBadge(assignment)}</td>
                                <td>
                                  <Link 
                                    to={`/academic/assignments/${assignment.id}`} 
                                    className="btn btn-sm btn-primary me-1"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  <button 
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(assignment.id, assignment.title)}
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
          <h1>{isEditMode ? 'Edit Assignment' : 'Create Assignment'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/academic/assignments">Assignments</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Create'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Assignment Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">
                          Assignment Title <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g., Research Paper on Climate Change"
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
                        <label className="form-label">Submission Type</label>
                        <select
                          className="form-select"
                          name="submissionType"
                          value={formData.submissionType}
                          onChange={handleChange}
                        >
                          <option value="Individual">Individual</option>
                          <option value="Group">Group</option>
                          <option value="Both">Both (Individual or Group)</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Max Marks</label>
                        <input
                          type="number"
                          className={`form-control ${errors.maxMarks ? 'is-invalid' : ''}`}
                          name="maxMarks"
                          value={formData.maxMarks}
                          onChange={handleChange}
                          placeholder="e.g., 100"
                          min="0"
                        />
                        {errors.maxMarks && <div className="invalid-feedback">{errors.maxMarks}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Weightage (%)</label>
                        <input
                          type="number"
                          className={`form-control ${errors.weightage ? 'is-invalid' : ''}`}
                          name="weightage"
                          value={formData.weightage}
                          onChange={handleChange}
                          placeholder="e.g., 20"
                          min="0"
                          max="100"
                        />
                        {errors.weightage && <div className="invalid-feedback">{errors.weightage}</div>}
                        <small className="form-text text-muted">Percentage weight in final grade</small>
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
                          placeholder="Brief description of the assignment"
                        />
                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Detailed Instructions</label>
                        <textarea
                          className="form-control"
                          name="instructions"
                          value={formData.instructions}
                          onChange={handleChange}
                          rows="5"
                          placeholder="Provide detailed instructions, requirements, and guidelines for students"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Grading Rubric</label>
                        <textarea
                          className="form-control"
                          name="rubric"
                          value={formData.rubric}
                          onChange={handleChange}
                          rows="4"
                          placeholder="Enter grading criteria and rubric details"
                        />
                        <small className="form-text text-muted">Specify how the assignment will be graded</small>
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
                        onClick={() => navigate('/academic/assignments')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Create'} Assignment
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

export default Assignments;

