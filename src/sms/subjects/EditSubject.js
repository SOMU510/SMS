import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const EditSubject = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { subjects, updateSubject, classes, teachers } = useSchool();
  const subject = subjects.find(s => s.id === parseInt(id));

  const [formData, setFormData] = useState({ name: '', code: '', class: 'All', teacher: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name || '',
        code: subject.code || '',
        class: subject.class || 'All',
        teacher: subject.teacher || ''
      });
    }
  }, [subject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Subject name is required';
    if (!formData.code.trim()) newErrors.code = 'Subject code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      updateSubject(parseInt(id), formData);
      navigate('/subjects');
    }
  };

  if (!subject) {
    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle"><h1>Subject Not Found</h1></div>
        </div>
      </main>
    );
  }

  const uniqueClasses = ['All', ...new Set(classes.map(c => c.name))].sort();

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Edit Subject</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item"><a href="/subjects">Subjects</a></li>
              <li className="breadcrumb-item active">Edit Subject</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Subject Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Subject Name <span className="text-danger">*</span></label>
                        <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          name="name" value={formData.name} onChange={handleChange} />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Subject Code <span className="text-danger">*</span></label>
                        <input type="text" className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                          name="code" value={formData.code} onChange={handleChange} />
                        {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Class</label>
                        <select className="form-select" name="class" value={formData.class} onChange={handleChange}>
                          {uniqueClasses.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Teacher</label>
                        <select className="form-select" name="teacher" value={formData.teacher} onChange={handleChange}>
                          <option value="">Select Teacher</option>
                          {teachers.map(teacher => (
                            <option key={teacher.id} value={`${teacher.firstName} ${teacher.lastName}`}>
                              {teacher.firstName} {teacher.lastName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="text-end">
                      <button type="button" className="btn btn-secondary me-2" onClick={() => navigate('/subjects')}>Cancel</button>
                      <button type="submit" className="btn btn-primary"><i className="bi bi-save"></i> Update Subject</button>
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

export default EditSubject;

