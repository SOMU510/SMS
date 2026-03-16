import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const ClassAllocation = () => {
  const { 
    students,
    classes,
    sections,
    academicYears,
    updateStudent
  } = useSchool();

  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Filter students
  let filteredStudents = students.filter(student =>
    student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedClass) {
    filteredStudents = filteredStudents.filter(s => s.class === selectedClass);
  }

  if (filterStatus !== 'All') {
    filteredStudents = filteredStudents.filter(s => s.status === filterStatus);
  }

  // Get available sections for selected class
  const availableSections = selectedClass
    ? sections.filter(s => s.className === selectedClass)
    : [];

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

  const handleBulkAllocate = () => {
    if (!selectedAcademicYear) {
      alert('Please select an academic year');
      return;
    }

    if (!selectedClass) {
      alert('Please select a class');
      return;
    }

    if (!selectedSection) {
      alert('Please select a section');
      return;
    }

    if (selectedStudents.length === 0) {
      alert('Please select at least one student');
      return;
    }

    if (window.confirm(`Allocate ${selectedStudents.length} student(s) to ${selectedClass}-${selectedSection}?`)) {
      selectedStudents.forEach(studentId => {
        const student = students.find(s => s.id === studentId);
        if (student) {
          updateStudent(studentId, {
            ...student,
            class: selectedClass,
            section: selectedSection,
            academicYear: selectedAcademicYear
          });
        }
      });
      alert(`Successfully allocated ${selectedStudents.length} student(s)!`);
      setSelectedStudents([]);
    }
  };

  const handleIndividualAllocate = (studentId, className, sectionName) => {
    if (!selectedAcademicYear) {
      alert('Please select an academic year');
      return;
    }

    const student = students.find(s => s.id === studentId);
    if (student) {
      if (window.confirm(`Allocate ${student.firstName} ${student.lastName} to ${className}-${sectionName}?`)) {
        updateStudent(studentId, {
          ...student,
          class: className,
          section: sectionName,
          academicYear: selectedAcademicYear
        });
        alert('Student allocated successfully!');
      }
    }
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Class & Section Allocation</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/students">Student Management</Link></li>
              <li className="breadcrumb-item active">Class & Section Allocation</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row mb-3">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Allocation Settings</h5>
                  <div className="row">
                    <div className="col-md-3">
                      <label className="form-label">
                        Academic Year <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={selectedAcademicYear}
                        onChange={(e) => setSelectedAcademicYear(e.target.value)}
                      >
                        <option value="">Select Academic Year</option>
                        {academicYears.map(ay => (
                          <option key={ay.id} value={ay.id}>{ay.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">
                        Class <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={selectedClass}
                        onChange={(e) => {
                          setSelectedClass(e.target.value);
                          setSelectedSection('');
                        }}
                      >
                        <option value="">Select Class</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.name}>{cls.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">
                        Section <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        disabled={!selectedClass}
                      >
                        <option value="">Select Section</option>
                        {availableSections.map(section => (
                          <option key={section.id} value={section.name}>{section.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">&nbsp;</label>
                      <button
                        className="btn btn-primary w-100"
                        onClick={handleBulkAllocate}
                        disabled={!selectedAcademicYear || !selectedClass || !selectedSection || selectedStudents.length === 0}
                      >
                        <i className="bi bi-check-all"></i> Allocate Selected ({selectedStudents.length})
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
                    <div className="d-flex gap-2">
                      <input
                        type="text"
                        className="form-control"
                        style={{ width: '250px' }}
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <select
                        className="form-select"
                        style={{ width: '150px' }}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
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
                          <th>Status</th>
                          <th>Actions</th>
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
                          filteredStudents.map((student) => (
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
                              <td>
                                <span className={`badge ${student.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                  {student.status}
                                </span>
                              </td>
                              <td>
                                {selectedClass && availableSections.length > 0 && (
                                  <div className="dropdown">
                                    <button
                                      className="btn btn-sm btn-primary dropdown-toggle"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                    >
                                      Allocate
                                    </button>
                                    <ul className="dropdown-menu">
                                      {availableSections.map(section => (
                                        <li key={section.id}>
                                          <button
                                            className="dropdown-item"
                                            onClick={() => handleIndividualAllocate(student.id, selectedClass, section.name)}
                                          >
                                            {selectedClass}-{section.name}
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
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
};

export default ClassAllocation;

