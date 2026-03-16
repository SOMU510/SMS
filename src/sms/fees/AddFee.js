import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const AddFee = () => {
  const navigate = useNavigate();
  const { addFee, students } = useSchool();
  const [formData, setFormData] = useState({
    studentId: '', feeType: 'Tuition Fee', amount: '', dueDate: '', status: 'Pending', paymentMethod: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.studentId) newErrors.studentId = 'Student is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const student = students.find(s => s.id === parseInt(formData.studentId));
      const feeData = {
        ...formData,
        studentName: `${student.firstName} ${student.lastName}`,
        class: student.class,
        amount: parseFloat(formData.amount),
        paidDate: formData.status === 'Paid' ? new Date().toISOString().split('T')[0] : null
      };
      addFee(feeData);
      navigate('/fees');
    }
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Add Fee Record</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item"><a href="/fees">Fees</a></li>
              <li className="breadcrumb-item active">Add Fee</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Fee Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Student <span className="text-danger">*</span></label>
                        <select className={`form-select ${errors.studentId ? 'is-invalid' : ''}`}
                          name="studentId" value={formData.studentId} onChange={handleChange}>
                          <option value="">Select Student</option>
                          {students.map(student => (
                            <option key={student.id} value={student.id}>
                              {student.admissionNo} - {student.firstName} {student.lastName} ({student.class})
                            </option>
                          ))}
                        </select>
                        {errors.studentId && <div className="invalid-feedback">{errors.studentId}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Fee Type</label>
                        <select className="form-select" name="feeType" value={formData.feeType} onChange={handleChange}>
                          <option value="Tuition Fee">Tuition Fee</option>
                          <option value="Library Fee">Library Fee</option>
                          <option value="Sports Fee">Sports Fee</option>
                          <option value="Lab Fee">Lab Fee</option>
                          <option value="Transport Fee">Transport Fee</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Amount <span className="text-danger">*</span></label>
                        <input type="number" className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                          name="amount" value={formData.amount} onChange={handleChange} />
                        {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Due Date <span className="text-danger">*</span></label>
                        <input type="date" className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
                          name="dueDate" value={formData.dueDate} onChange={handleChange} />
                        {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </div>
                      {formData.status === 'Paid' && (
                        <div className="col-md-6">
                          <label className="form-label">Payment Method</label>
                          <select className="form-select" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                            <option value="">Select Method</option>
                            <option value="Cash">Cash</option>
                            <option value="Online">Online</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="text-end">
                      <button type="button" className="btn btn-secondary me-2" onClick={() => navigate('/fees')}>Cancel</button>
                      <button type="submit" className="btn btn-primary"><i className="bi bi-save"></i> Save Fee</button>
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

export default AddFee;

