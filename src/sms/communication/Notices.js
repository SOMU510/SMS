import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const Notices = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { 
    notices,
    classes,
    sections,
    addNotice,
    updateNotice,
    deleteNotice
  } = useSchool();
  
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    noticeNumber: '',
    title: '',
    content: '',
    noticeType: 'Notice', // Notice, Circular, Memo
    category: 'General', // General, Academic, Administrative, Fee, Exam
    targetAudience: 'All',
    targetClass: '',
    targetSection: '',
    issueDate: new Date().toISOString().split('T')[0],
    effectiveDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    isImportant: false,
    status: 'Active'
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Load notice data if editing
  useEffect(() => {
    if (isEditMode) {
      const notice = notices.find(n => n.id === parseInt(id));
      if (notice) {
        setFormData({
          noticeNumber: notice.noticeNumber || '',
          title: notice.title || '',
          content: notice.content || '',
          noticeType: notice.noticeType || 'Notice',
          category: notice.category || 'General',
          targetAudience: notice.targetAudience || 'All',
          targetClass: notice.targetClass || '',
          targetSection: notice.targetSection || '',
          issueDate: notice.issueDate || new Date().toISOString().split('T')[0],
          effectiveDate: notice.effectiveDate || new Date().toISOString().split('T')[0],
          expiryDate: notice.expiryDate || '',
          isImportant: notice.isImportant || false,
          status: notice.status || 'Active'
        });
      }
    } else if (isAddMode) {
      // Generate notice number
      const nextNumber = notices.length > 0 
        ? Math.max(...notices.map(n => parseInt(n.noticeNumber?.replace('NOT-', '') || 0))) + 1
        : 1;
      setFormData(prev => ({
        ...prev,
        noticeNumber: `NOT-${String(nextNumber).padStart(4, '0')}`
      }));
    }
  }, [id, isEditMode, isAddMode, notices]);

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
    
    if (!formData.issueDate) {
      newErrors.issueDate = 'Issue date is required';
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
        updateNotice(parseInt(id), formData);
        alert('Notice updated successfully!');
      } else {
        addNotice(formData);
        alert('Notice created successfully!');
      }
      navigate('/communication/notices');
    }
  };

  const handleDelete = (noticeId, title) => {
    if (window.confirm(`Are you sure you want to delete notice "${title}"?`)) {
      deleteNotice(noticeId);
    }
  };

  // Filter notices
  let filteredNotices = notices.filter(notice =>
    notice.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.noticeNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterType !== 'All') {
    filteredNotices = filteredNotices.filter(n => n.noticeType === filterType);
  }

  if (filterCategory !== 'All') {
    filteredNotices = filteredNotices.filter(n => n.category === filterCategory);
  }

  if (filterStatus !== 'All') {
    filteredNotices = filteredNotices.filter(n => n.status === filterStatus);
  }

  const getCategoryBadge = (category) => {
    switch(category) {
      case 'Academic': return 'bg-info';
      case 'Fee': return 'bg-warning';
      case 'Exam': return 'bg-danger';
      case 'Administrative': return 'bg-primary';
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
            <h1>Notices & Circulars</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/communication">Communication</Link></li>
                <li className="breadcrumb-item active">Notices & Circulars</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Notices & Circulars</h5>
                      <Link to="/communication/notices/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Create Notice
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by title, number..."
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
                          <option value="Notice">Notice</option>
                          <option value="Circular">Circular</option>
                          <option value="Memo">Memo</option>
                        </select>
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-select"
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value)}
                        >
                          <option value="All">All Categories</option>
                          <option value="General">General</option>
                          <option value="Academic">Academic</option>
                          <option value="Administrative">Administrative</option>
                          <option value="Fee">Fee</option>
                          <option value="Exam">Exam</option>
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
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Notice Number</th>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Category</th>
                            <th>Target Audience</th>
                            <th>Issue Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredNotices.length === 0 ? (
                            <tr>
                              <td colSpan="8" className="text-center">
                                <p className="text-muted">No notices found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredNotices.map((notice) => (
                              <tr key={notice.id}>
                                <td><strong>{notice.noticeNumber}</strong></td>
                                <td>
                                  {notice.title}
                                  {notice.isImportant && (
                                    <span className="badge bg-danger ms-2">Important</span>
                                  )}
                                </td>
                                <td>{notice.noticeType}</td>
                                <td>
                                  <span className={`badge ${getCategoryBadge(notice.category)}`}>
                                    {notice.category}
                                  </span>
                                </td>
                                <td>
                                  {notice.targetAudience}
                                  {notice.targetClass && ` - ${notice.targetClass}`}
                                </td>
                                <td>{notice.issueDate ? new Date(notice.issueDate).toLocaleDateString() : '-'}</td>
                                <td>
                                  <span className={`badge ${notice.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                    {notice.status}
                                  </span>
                                </td>
                                <td>
                                  <Link
                                    to={`/communication/notices/${notice.id}`}
                                    className="btn btn-sm btn-primary me-1"
                                    title="Edit"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(notice.id, notice.title)}
                                    title="Delete"
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

  // Form view
  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>{isEditMode ? 'Edit Notice' : 'Create Notice'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/communication/notices">Notices</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Create'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Notice Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-3">
                        <label className="form-label">Notice Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="noticeNumber"
                          value={formData.noticeNumber}
                          onChange={handleChange}
                          disabled
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">
                          Notice Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="noticeType"
                          value={formData.noticeType}
                          onChange={handleChange}
                        >
                          <option value="Notice">Notice</option>
                          <option value="Circular">Circular</option>
                          <option value="Memo">Memo</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">
                          Category <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                        >
                          <option value="General">General</option>
                          <option value="Academic">Academic</option>
                          <option value="Administrative">Administrative</option>
                          <option value="Fee">Fee</option>
                          <option value="Exam">Exam</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <div className="form-check mt-4">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="isImportant"
                            checked={formData.isImportant}
                            onChange={handleChange}
                            id="isImportant"
                          />
                          <label className="form-check-label" htmlFor="isImportant">
                            Mark as Important
                          </label>
                        </div>
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
                          placeholder="Enter notice title"
                        />
                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
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
                          rows="8"
                          placeholder="Enter notice content"
                        />
                        {errors.content && <div className="invalid-feedback">{errors.content}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
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
                          <div className="col-md-4">
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
                          <div className="col-md-4">
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
                          Issue Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className={`form-control ${errors.issueDate ? 'is-invalid' : ''}`}
                          name="issueDate"
                          value={formData.issueDate}
                          onChange={handleChange}
                        />
                        {errors.issueDate && <div className="invalid-feedback">{errors.issueDate}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Effective Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="effectiveDate"
                          value={formData.effectiveDate}
                          onChange={handleChange}
                          min={formData.issueDate}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Expiry Date (Optional)</label>
                        <input
                          type="date"
                          className="form-control"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          min={formData.effectiveDate || formData.issueDate}
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate('/communication/notices')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Create'} Notice
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

export default Notices;

