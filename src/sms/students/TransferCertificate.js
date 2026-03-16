import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';
import jsPDF from 'jspdf';

const TransferCertificate = () => {
  const { id } = useParams();
  const { students, classes, academicYears } = useSchool();
  
  const [formData, setFormData] = useState({
    studentId: '',
    transferDate: new Date().toISOString().split('T')[0],
    reason: 'Transfer',
    leavingDate: new Date().toISOString().split('T')[0],
    tcNumber: '',
    remarks: ''
  });
  const [errors, setErrors] = useState({});
  const [tcHistory, setTcHistory] = useState([]);

  const selectedStudent = students.find(s => s.id === parseInt(formData.studentId));

  useEffect(() => {
    if (id) {
      setFormData(prev => ({ ...prev, studentId: id }));
    }
    // Generate TC number
    const tcNum = `TC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    setFormData(prev => ({ ...prev, tcNumber: tcNum }));
  }, [id]);

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
    
    if (!formData.studentId) {
      newErrors.studentId = 'Please select a student';
    }
    
    if (!formData.transferDate) {
      newErrors.transferDate = 'Transfer date is required';
    }
    
    if (!formData.leavingDate) {
      newErrors.leavingDate = 'Leaving date is required';
    }
    
    if (!formData.tcNumber.trim()) {
      newErrors.tcNumber = 'TC number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateTC = () => {
    if (validate()) {
      const tc = {
        id: tcHistory.length + 1,
        ...formData,
        studentName: selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : '',
        admissionNo: selectedStudent?.admissionNo || '',
        generatedDate: new Date().toISOString()
      };
      setTcHistory([...tcHistory, tc]);
      alert('Transfer Certificate generated successfully!');
    }
  };

  const handleDownloadPDF = (tc) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('TRANSFER CERTIFICATE', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`TC No: ${tc.tcNumber}`, 20, 35);
    doc.text(`Date: ${new Date(tc.transferDate).toLocaleDateString()}`, 150, 35);
    
    // Student Information
    doc.setFontSize(14);
    doc.text('This is to certify that', 20, 50);
    
    doc.setFontSize(12);
    doc.text(`Name: ${tc.studentName}`, 20, 60);
    doc.text(`Admission No: ${tc.admissionNo}`, 20, 68);
    doc.text(`Class: ${selectedStudent?.class || 'N/A'}`, 20, 76);
    doc.text(`Section: ${selectedStudent?.section || 'N/A'}`, 20, 84);
    doc.text(`Date of Birth: ${selectedStudent?.dateOfBirth ? new Date(selectedStudent.dateOfBirth).toLocaleDateString() : 'N/A'}`, 20, 92);
    
    doc.text(`was a student of this school from ${selectedStudent?.admissionDate ? new Date(selectedStudent.admissionDate).toLocaleDateString() : 'N/A'}`, 20, 105);
    doc.text(`to ${new Date(tc.leavingDate).toLocaleDateString()}.`, 20, 113);
    
    doc.text(`Reason for Leaving: ${tc.reason}`, 20, 125);
    
    if (tc.remarks) {
      doc.text(`Remarks: ${tc.remarks}`, 20, 135);
    }
    
    // Footer
    doc.setFontSize(10);
    doc.text('This certificate is issued on request of the student/parent.', 20, 160);
    doc.text('Principal', 150, 180);
    doc.text('School Seal', 20, 180);
    
    // Save PDF
    const fileName = `TC_${tc.admissionNo}_${tc.tcNumber}.pdf`;
    doc.save(fileName);
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Transfer Certificate</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/students">Student Management</Link></li>
              <li className="breadcrumb-item active">Transfer Certificate</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Generate Transfer Certificate</h5>
                  <form>
                    <div className="mb-3">
                      <label className="form-label">
                        Select Student <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-select ${errors.studentId ? 'is-invalid' : ''}`}
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                      >
                        <option value="">Select Student</option>
                        {students.map(student => (
                          <option key={student.id} value={student.id}>
                            {student.admissionNo} - {student.firstName} {student.lastName} ({student.class})
                          </option>
                        ))}
                      </select>
                      {errors.studentId && <div className="invalid-feedback">{errors.studentId}</div>}
                    </div>

                    {selectedStudent && (
                      <div className="alert alert-info">
                        <strong>Student Details:</strong><br />
                        Name: {selectedStudent.firstName} {selectedStudent.lastName}<br />
                        Admission No: {selectedStudent.admissionNo}<br />
                        Class: {selectedStudent.class} - {selectedStudent.section}<br />
                        Admission Date: {selectedStudent.admissionDate ? new Date(selectedStudent.admissionDate).toLocaleDateString() : 'N/A'}
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label">
                        TC Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.tcNumber ? 'is-invalid' : ''}`}
                        name="tcNumber"
                        value={formData.tcNumber}
                        onChange={handleChange}
                        placeholder="TC Number"
                      />
                      {errors.tcNumber && <div className="invalid-feedback">{errors.tcNumber}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Transfer Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className={`form-control ${errors.transferDate ? 'is-invalid' : ''}`}
                        name="transferDate"
                        value={formData.transferDate}
                        onChange={handleChange}
                      />
                      {errors.transferDate && <div className="invalid-feedback">{errors.transferDate}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Leaving Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className={`form-control ${errors.leavingDate ? 'is-invalid' : ''}`}
                        name="leavingDate"
                        value={formData.leavingDate}
                        onChange={handleChange}
                      />
                      {errors.leavingDate && <div className="invalid-feedback">{errors.leavingDate}</div>}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Reason for Transfer</label>
                      <select
                        className="form-select"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                      >
                        <option value="Transfer">Transfer</option>
                        <option value="Completion of Course">Completion of Course</option>
                        <option value="Withdrawal">Withdrawal</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Remarks</label>
                      <textarea
                        className="form-control"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Additional remarks (optional)"
                      />
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleGenerateTC}
                    >
                      <i className="bi bi-file-earmark-text"></i> Generate TC
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Generated Transfer Certificates</h5>
                  {tcHistory.length === 0 ? (
                    <p className="text-muted">No transfer certificates generated yet</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>TC No</th>
                            <th>Student</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tcHistory.map(tc => (
                            <tr key={tc.id}>
                              <td><strong>{tc.tcNumber}</strong></td>
                              <td>{tc.studentName}</td>
                              <td>{new Date(tc.transferDate).toLocaleDateString()}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDownloadPDF(tc)}
                                >
                                  <i className="bi bi-download"></i> Download PDF
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default TransferCertificate;

