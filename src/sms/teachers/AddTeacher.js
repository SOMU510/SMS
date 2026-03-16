import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const AddTeacher = () => {
  const navigate = useNavigate();
  const { addTeacher, classes, subjects } = useSchool();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    qualification: '',
    experience: '',
    subject: '',
    class: '',
    joiningDate: new Date().toISOString().split('T')[0],
    salary: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addTeacher(formData);
      navigate('/teachers');
    }
  };

  const uniqueClasses = [...new Set(classes.map(c => c.name))].sort();

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Add New Teacher</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item"><a href="/teachers">Teachers</a></li>
              <li className="breadcrumb-item active">Add Teacher</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Teacher Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">First Name <span className="text-danger">*</span></label>
                        <input type="text" className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          name="firstName" value={formData.firstName} onChange={handleChange} />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Last Name <span className="text-danger">*</span></label>
                        <input type="text" className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                          name="lastName" value={formData.lastName} onChange={handleChange} />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Email <span className="text-danger">*</span></label>
                        <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          name="email" value={formData.email} onChange={handleChange} />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Phone <span className="text-danger">*</span></label>
                        <input type="tel" className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          name="phone" value={formData.phone} onChange={handleChange} />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Date of Birth</label>
                        <input type="date" className="form-control" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Gender</label>
                        <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Status</label>
                        <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Address</label>
                        <textarea className="form-control" rows="3" name="address" value={formData.address} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Qualification <span className="text-danger">*</span></label>
                        <input type="text" className={`form-control ${errors.qualification ? 'is-invalid' : ''}`}
                          name="qualification" value={formData.qualification} onChange={handleChange} />
                        {errors.qualification && <div className="invalid-feedback">{errors.qualification}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Experience</label>
                        <input type="text" className="form-control" name="experience" value={formData.experience} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Subject <span className="text-danger">*</span></label>
                        <select className={`form-select ${errors.subject ? 'is-invalid' : ''}`}
                          name="subject" value={formData.subject} onChange={handleChange}>
                          <option value="">Select Subject</option>
                          {subjects.map(sub => (
                            <option key={sub.id} value={sub.name}>{sub.name}</option>
                          ))}
                        </select>
                        {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Class</label>
                        <select className="form-select" name="class" value={formData.class} onChange={handleChange}>
                          <option value="">Select Class</option>
                          {uniqueClasses.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Joining Date</label>
                        <input type="date" className="form-control" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Salary</label>
                        <input type="number" className="form-control" name="salary" value={formData.salary} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="text-end">
                      <button type="button" className="btn btn-secondary me-2" onClick={() => navigate('/teachers')}>Cancel</button>
                      <button type="submit" className="btn btn-primary"><i className="bi bi-save"></i> Save Teacher</button>
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

export default AddTeacher;

