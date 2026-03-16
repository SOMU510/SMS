import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const AddClass = () => {
  const navigate = useNavigate();
  const { addClass } = useSchool();
  const [formData, setFormData] = useState({
    name: '', sections: ['A'], capacity: 40
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSectionChange = (e) => {
    const sections = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, sections }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Class name is required';
    if (formData.sections.length === 0) newErrors.sections = 'At least one section is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addClass(formData);
      navigate('/classes');
    }
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Add New Class</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item"><a href="/classes">Classes</a></li>
              <li className="breadcrumb-item active">Add Class</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Class Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Class Name <span className="text-danger">*</span></label>
                        <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          name="name" value={formData.name} onChange={handleChange} />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Capacity</label>
                        <input type="number" className="form-control" name="capacity"
                          value={formData.capacity} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Sections <span className="text-danger">*</span></label>
                        <select multiple className={`form-select ${errors.sections ? 'is-invalid' : ''}`}
                          value={formData.sections} onChange={handleSectionChange}>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                        </select>
                        {errors.sections && <div className="invalid-feedback">{errors.sections}</div>}
                        <small className="form-text text-muted">Hold Ctrl/Cmd to select multiple sections</small>
                      </div>
                    </div>

                    <div className="text-end">
                      <button type="button" className="btn btn-secondary me-2" onClick={() => navigate('/classes')}>Cancel</button>
                      <button type="submit" className="btn btn-primary"><i className="bi bi-save"></i> Save Class</button>
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

export default AddClass;

