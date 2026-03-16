import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const StudentPromotion = () => {
  const { 
    students,
    classes,
    sections,
    academicYears,
    updateStudent
  } = useSchool();

  const [fromAcademicYear, setFromAcademicYear] = useState('');
  const [toAcademicYear, setToAcademicYear] = useState('');
  const [fromClass, setFromClass] = useState('');
  const [toClass, setToClass] = useState('');
  const [promotionType, setPromotionType] = useState('Promote'); // Promote, Demote, Same Class
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter students
  let filteredStudents = students.filter(student =>
    (student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (fromClass ? student.class === fromClass : true)
  );

  const handleStudentSelect = (studentId, checked) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedStudents(filteredStudents.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const getNextClass = (currentClass) => {
    // Simple promotion logic - in real app, this would be more sophisticated
    const classOrder = classes.map(c => c.name).sort();
    const currentIndex = classOrder.indexOf(currentClass);
    if (currentIndex >= 0 && currentIndex < classOrder.length - 1) {
      return classOrder[currentIndex + 1];
    }
    return currentClass; // Already at highest class
  };

  const getPreviousClass = (currentClass) => {
    const classOrder = classes.map(c => c.name).sort();
    const currentIndex = classOrder.indexOf(currentClass);
    if (currentIndex > 0) {
      return classOrder[currentIndex - 1];
    }
    return currentClass; // Already at lowest class
  };

  const handlePromote = () => {
    if (!fromAcademicYear || !toAcademicYear) {
      alert('Please select both academic years');
      return;
    }

    if (selectedStudents.length === 0) {
      alert('Please select at least one student');
      return;
    }

    const action = promotionType === 'Promote' ? 'promote' : promotionType === 'Demote' ? 'demote' : 'keep in same class';
    
    if (window.confirm(`Are you sure you want to ${action} ${selectedStudents.length} student(s)?`)) {
      selectedStudents.forEach(studentId => {
        const student = students.find(s => s.id === studentId);
        if (student) {
          let newClass = student.class;
          
          if (promotionType === 'Promote') {
            newClass = toClass || getNextClass(student.class);
          } else if (promotionType === 'Demote') {
            newClass = toClass || getPreviousClass(student.class);
          } else {
            newClass = student.class; // Same class
          }

          updateStudent(studentId, {
            ...student,
            class: newClass,
            academicYear: toAcademicYear,
            promotionDate: new Date().toISOString().split('T')[0]
          });
        }
      });
      alert(`Successfully ${action}d ${selectedStudents.length} student(s)!`);
      setSelectedStudents([]);
    }
  };

  // Get available sections for target class
  const availableSections = toClass
    ? sections.filter(s => s.className === toClass)
    : [];

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Student Promotion</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/students">Student Management</Link></li>
              <li className="breadcrumb-item active">Student Promotion</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row mb-3">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Promotion Settings</h5>
                  <div className="row">
                    <div className="col-md-3">
                      <label className="form-label">
                        From Academic Year <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={fromAcademicYear}
                        onChange={(e) => setFromAcademicYear(e.target.value)}
                      >
                        <option value="">Select Academic Year</option>
                        {academicYears.map(ay => (
                          <option key={ay.id} value={ay.id}>{ay.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">
                        To Academic Year <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={toAcademicYear}
                        onChange={(e) => setToAcademicYear(e.target.value)}
                      >
                        <option value="">Select Academic Year</option>
                        {academicYears.map(ay => (
                          <option key={ay.id} value={ay.id}>{ay.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Promotion Type</label>
                      <select
                        className="form-select"
                        value={promotionType}
                        onChange={(e) => setPromotionType(e.target.value)}
                      >
                        <option value="Promote">Promote to Next Class</option>
                        <option value="Demote">Demote to Previous Class</option>
                        <option value="Same Class">Keep in Same Class</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">From Class</label>
                      <select
                        className="form-select"
                        value={fromClass}
                        onChange={(e) => setFromClass(e.target.value)}
                      >
                        <option value="">All Classes</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.name}>{cls.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {promotionType !== 'Same Class' && (
                    <div className="row mt-3">
                      <div className="col-md-3">
                        <label className="form-label">To Class (Optional)</label>
                        <select
                          className="form-select"
                          value={toClass}
                          onChange={(e) => setToClass(e.target.value)}
                        >
                          <option value="">Auto (Next/Previous)</option>
                          {classes.map(cls => (
                            <option key={cls.id} value={cls.name}>{cls.name}</option>
                          ))}
                        </select>
                        <small className="text-muted">Leave empty for automatic promotion/demotion</small>
                      </div>
                    </div>
                  )}
                  <div className="row mt-3">
                    <div className="col-md-12">
                      <button
                        className="btn btn-success"
                        onClick={handlePromote}
                        disabled={!fromAcademicYear || !toAcademicYear || selectedStudents.length === 0}
                      >
                        <i className="bi bi-arrow-up-circle"></i> {promotionType} Selected Students ({selectedStudents.length})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title">Student List</h5>
                    <input
                      type="text"
                      className="form-control"
                      style={{ width: '300px' }}
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th style={{ width: '50px' }}>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                              onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                          </th>
                          <th>Admission No</th>
                          <th>Student Name</th>
                          <th>Current Class</th>
                          <th>Current Section</th>
                          <th>Academic Year</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center text-muted">
                              No students found
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((student) => {
                            const nextClass = getNextClass(student.class);
                            const previousClass = getPreviousClass(student.class);
                            return (
                              <tr key={student.id}>
                                <td>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={selectedStudents.includes(student.id)}
                                    onChange={(e) => handleStudentSelect(student.id, e.target.checked)}
                                  />
                                </td>
                                <td><strong>{student.admissionNo}</strong></td>
                                <td>{student.firstName} {student.lastName}</td>
                                <td>{student.class || '-'}</td>
                                <td>{student.section || '-'}</td>
                                <td>{student.academicYear || '-'}</td>
                                <td>
                                  <span className={`badge ${student.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                    {student.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
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
};

export default StudentPromotion;

