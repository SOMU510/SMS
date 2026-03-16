import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const AddExam = () => {
  const navigate = useNavigate();
  const { addExam, classes, subjects } = useSchool();
  const [formData, setFormData] = useState({
    name: '', class: '', subject: '', examDate: '', maxMarks: 100, passingMarks: 33
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Exam name is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.examDate) newErrors.examDate = 'Exam date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addExam({ ...formData, maxMarks: parseInt(formData.maxMarks), passingMarks: parseInt(formData.passingMarks) });
      navigate('/exams');
    }
  };

  const uniqueClasses = [...new Set(classes.map(c => c.name))].sort();

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Add New Exam</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item"><a href="/exams">Exams</a></li>
              <li className="breadcrumb-item active">Add Exam</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Exam Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Exam Name <span className="text-danger">*</span></label>
                        <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          name="name" value={formData.name} onChange={handleChange} />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Class <span className="text-danger">*</span></label>
                        <select className={`form-select ${errors.class ? 'is-invalid' : ''}`}
                          name="class" value={formData.class} onChange={handleChange}>
                          <option value="">Select Class</option>
                          {uniqueClasses.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                        {errors.class && <div className="invalid-feedback">{errors.class}</div>}
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
                        <label className="form-label">Exam Date <span className="text-danger">*</span></label>
                        <input type="date" className={`form-control ${errors.examDate ? 'is-invalid' : ''}`}
                          name="examDate" value={formData.examDate} onChange={handleChange} />
                        {errors.examDate && <div className="invalid-feedback">{errors.examDate}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Max Marks</label>
                        <input type="number" className="form-control" name="maxMarks"
                          value={formData.maxMarks} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Passing Marks</label>
                        <input type="number" className="form-control" name="passingMarks"
                          value={formData.passingMarks} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="text-end">
                      <button type="button" className="btn btn-secondary me-2" onClick={() => navigate('/exams')}>Cancel</button>
                      <button type="submit" className="btn btn-primary"><i className="bi bi-save"></i> Save Exam</button>
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

export default AddExam;

