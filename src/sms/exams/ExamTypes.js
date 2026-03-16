import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const ExamTypes = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { 
    examTypes,
    addExamType,
    updateExamType,
    deleteExamType
  } = useSchool();
  
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    weightage: 0,
    isFinal: false,
    status: 'Active'
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Load exam type data if editing
  useEffect(() => {
    if (isEditMode) {
      const examType = examTypes.find(et => et.id === parseInt(id));
      if (examType) {
        setFormData({
          name: examType.name || '',
          code: examType.code || '',
          description: examType.description || '',
          weightage: examType.weightage || 0,
          isFinal: examType.isFinal || false,
          status: examType.status || 'Active'
        });
      }
    }
  }, [id, isEditMode, examTypes]);

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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Exam type name is required';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Exam type code is required';
    }
    
    if (formData.weightage < 0 || formData.weightage > 100) {
      newErrors.weightage = 'Weightage must be between 0 and 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isEditMode) {
        updateExamType(parseInt(id), formData);
        alert('Exam type updated successfully!');
      } else {
        // Check for duplicate code
        const existing = examTypes.find(et => et.code.toLowerCase() === formData.code.toLowerCase());
        if (existing) {
          alert('Exam type with this code already exists!');
          return;
        }
        addExamType(formData);
        alert('Exam type created successfully!');
      }
      navigate('/exams/types');
    }
  };

  const handleDelete = (examTypeId, name) => {
    if (window.confirm(`Are you sure you want to delete exam type "${name}"?`)) {
      deleteExamType(examTypeId);
    }
  };

  // Filter exam types
  const filteredExamTypes = examTypes.filter(et =>
    et.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    et.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    return status === 'Active' ? 'bg-success' : 'bg-secondary';
  };

  // If not in add/edit mode, show list view
  if (!showForm) {
    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Exam Types</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/exams">Exams</Link></li>
                <li className="breadcrumb-item active">Exam Types</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Exam Types</h5>
                      <Link to="/exams/types/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Add Exam Type
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by name or code..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Weightage (%)</th>
                            <th>Final Exam</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredExamTypes.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="text-center">
                                <p className="text-muted">No exam types found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredExamTypes.map((examType) => (
                              <tr key={examType.id}>
                                <td><strong>{examType.code}</strong></td>
                                <td>{examType.name}</td>
                                <td>{examType.description || '-'}</td>
                                <td>{examType.weightage}%</td>
                                <td>
                                  {examType.isFinal ? (
                                    <span className="badge bg-info">Yes</span>
                                  ) : (
                                    <span className="badge bg-secondary">No</span>
                                  )}
                                </td>
                                <td>
                                  <span className={`badge ${getStatusBadge(examType.status)}`}>
                                    {examType.status}
                                  </span>
                                </td>
                                <td>
                                  <Link
                                    to={`/exams/types/${examType.id}`}
                                    className="btn btn-sm btn-primary me-1"
                                    title="Edit"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(examType.id, examType.name)}
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

  // Form view (for both add and edit)
  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>{isEditMode ? 'Edit Exam Type' : 'Add Exam Type'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/exams/types">Exam Types</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Add'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Exam Type Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Exam Type Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g., Mid-Term Exam"
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Code <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                          name="code"
                          value={formData.code}
                          onChange={handleChange}
                          placeholder="e.g., MT"
                        />
                        {errors.code && <div className="invalid-feedback">{errors.code}</div>}
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
                          placeholder="Description of the exam type"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Weightage (%)</label>
                        <input
                          type="number"
                          className={`form-control ${errors.weightage ? 'is-invalid' : ''}`}
                          name="weightage"
                          value={formData.weightage}
                          onChange={handleChange}
                          min="0"
                          max="100"
                        />
                        {errors.weightage && <div className="invalid-feedback">{errors.weightage}</div>}
                        <small className="form-text text-muted">Percentage weight in final result calculation</small>
                      </div>
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
                      <div className="col-md-4">
                        <div className="form-check mt-4">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="isFinal"
                            checked={formData.isFinal}
                            onChange={handleChange}
                            id="isFinal"
                          />
                          <label className="form-check-label" htmlFor="isFinal">
                            Final Examination
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate('/exams/types')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Create'} Exam Type
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

export default ExamTypes;

