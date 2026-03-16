import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const AddAcademicYear = () => {
  const navigate = useNavigate();
  const { addAcademicYear } = useSchool();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: '',
    isCurrent: false,
    status: 'Upcoming'
  });
  const [errors, setErrors] = useState({});

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
      newErrors.name = 'Academic year name is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    // Auto-set status based on dates
    if (formData.startDate && formData.endDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (start > today) {
        formData.status = 'Upcoming';
      } else if (end < today) {
        formData.status = 'Completed';
      } else {
        formData.status = 'Active';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addAcademicYear(formData);
      alert('Academic year added successfully!');
      navigate('/academic/year');
    }
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Add Academic Year</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item"><a href="/academic/year">Academic Year</a></li>
              <li className="breadcrumb-item active">Add Academic Year</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Academic Year Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Academic Year Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g., 2024-2025"
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        <small className="form-text text-muted">
                          Example: 2024-2025, Academic Year 2024-25
                        </small>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Description</label>
                        <input
                          type="text"
                          className="form-control"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Optional description"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
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
                      <div className="col-md-6">
                        <label className="form-label">
                          End Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                        />
                        {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
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
                          <option value="Upcoming">Upcoming</option>
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <small className="form-text text-muted">
                          Status will be auto-updated based on dates
                        </small>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check mt-4">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="isCurrent"
                            checked={formData.isCurrent}
                            onChange={handleChange}
                            id="isCurrent"
                          />
                          <label className="form-check-label" htmlFor="isCurrent">
                            Set as Current Academic Year
                          </label>
                        </div>
                        <small className="form-text text-muted">
                          Only one academic year can be set as current
                        </small>
                      </div>
                    </div>

                    <div className="text-end">
                      <button 
                        type="button" 
                        className="btn btn-secondary me-2" 
                        onClick={() => navigate('/academic/year')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> Save Academic Year
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

export default AddAcademicYear;

