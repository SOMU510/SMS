import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const EditSection = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { sections, classes, updateSection } = useSchool();
  const [formData, setFormData] = useState({
    name: '',
    className: '',
    capacity: 40,
    description: '',
    classTeacher: '',
    status: 'Active'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const section = sections.find(s => s.id === parseInt(id));
    if (section) {
      setFormData({
        name: section.name || '',
        className: section.className || '',
        capacity: section.capacity || 40,
        description: section.description || '',
        classTeacher: section.classTeacher || '',
        status: section.status || 'Active'
      });
    }
  }, [id, sections]);

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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Section name is required';
    }
    
    if (!formData.className) {
      newErrors.className = 'Class is required';
    }

    if (formData.capacity && formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      updateSection(parseInt(id), formData);
      alert('Section updated successfully!');
      navigate('/academic/sections');
    }
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Edit Section</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item"><a href="/academic/sections">Sections</a></li>
              <li className="breadcrumb-item active">Edit Section</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Section Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Section Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g., A, B, C"
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                      <div className="col-md-6">
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
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Capacity</label>
                        <input
                          type="number"
                          className={`form-control ${errors.capacity ? 'is-invalid' : ''}`}
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleChange}
                          min="1"
                        />
                        {errors.capacity && <div className="invalid-feedback">{errors.capacity}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Class Teacher</label>
                        <input
                          type="text"
                          className="form-control"
                          name="classTeacher"
                          value={formData.classTeacher}
                          onChange={handleChange}
                          placeholder="Optional - Assign class teacher"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Optional description or notes"
                        />
                      </div>
                      <div className="col-md-6">
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
                        onClick={() => navigate('/academic/sections')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> Update Section
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

export default EditSection;

