import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const ReportCards = () => {
  const { 
    students, 
    classes, 
    sections,
    academicYears,
    results,
    exams
  } = useSchool();

  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Get current academic year
  const currentAcademicYear = academicYears.find(ay => ay.isCurrent) || academicYears[0];
  const currentYearId = currentAcademicYear?.id;

  // Filter sections based on selected class
  const selectedClassObj = classes.find(c => c.name === selectedClass);
  const availableSections = selectedClass && selectedClassObj
    ? sections.filter(s => s.className === selectedClass)
    : [];

  // Filter students
  let filteredStudents = students.filter(s => {
    const matchesClass = !selectedClass || s.class === selectedClass;
    const matchesSection = !selectedSection || s.section === selectedSection;
    const matchesSearch = !searchTerm || 
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSection && matchesSearch;
  });

  // Set default academic year
  useEffect(() => {
    if (currentYearId && !selectedAcademicYear) {
      setSelectedAcademicYear(currentYearId);
    }
  }, [currentYearId, selectedAcademicYear]);

  // Get student results
  const getStudentResults = (studentId) => {
    return results.filter(r => r.studentId === studentId);
  };

  // Calculate overall statistics
  const getStudentStats = (studentId) => {
    const studentResults = getStudentResults(studentId);
    if (studentResults.length === 0) {
      return { totalExams: 0, totalMarks: 0, obtainedMarks: 0, average: 0, passed: 0, failed: 0 };
    }

    const totalMarks = studentResults.reduce((sum, r) => sum + (r.maxMarks || 0), 0);
    const obtainedMarks = studentResults.reduce((sum, r) => sum + (r.marks || 0), 0);
    const average = totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(2) : 0;
    const passed = studentResults.filter(r => r.status === 'Pass').length;
    const failed = studentResults.filter(r => r.status === 'Fail').length;

    return {
      totalExams: studentResults.length,
      totalMarks,
      obtainedMarks,
      average: parseFloat(average),
      passed,
      failed
    };
  };

  const selectedStudentData = students.find(s => s.id === parseInt(selectedStudent));
  const studentResults = selectedStudent ? getStudentResults(parseInt(selectedStudent)) : [];
  const studentStats = selectedStudent ? getStudentStats(parseInt(selectedStudent)) : null;

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Report Cards</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/results">Results</Link></li>
              <li className="breadcrumb-item active">Report Cards</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row mb-3">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Filter Options</h5>
                  <div className="row">
                    <div className="col-md-3">
                      <label className="form-label">Academic Year</label>
                      <select
                        className="form-select"
                        value={selectedAcademicYear}
                        onChange={(e) => {
                          setSelectedAcademicYear(e.target.value);
                          setSelectedClass('');
                          setSelectedSection('');
                        }}
                      >
                        <option value="">All Academic Years</option>
                        {academicYears.map(ay => (
                          <option key={ay.id} value={ay.id}>
                            {ay.name} {ay.isCurrent && '(Current)'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Class</label>
                      <select
                        className="form-select"
                        value={selectedClass}
                        onChange={(e) => {
                          setSelectedClass(e.target.value);
                          setSelectedSection('');
                        }}
                      >
                        <option value="">All Classes</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.name}>{cls.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Section</label>
                      <select
                        className="form-select"
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        disabled={!selectedClass}
                      >
                        <option value="">All Sections</option>
                        {availableSections.map(section => (
                          <option key={section.id} value={section.id}>{section.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Search Student</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name or admission no..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
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
                  <h5 className="card-title">Student List</h5>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Admission No</th>
                          <th>Student Name</th>
                          <th>Class</th>
                          <th>Section</th>
                          <th>Total Exams</th>
                          <th>Average %</th>
                          <th>Passed</th>
                          <th>Failed</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="text-center text-muted">
                              No students found
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((student) => {
                            const stats = getStudentStats(student.id);
                            return (
                              <tr 
                                key={student.id}
                                className={selectedStudent === student.id.toString() ? 'table-active' : ''}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setSelectedStudent(student.id.toString())}
                              >
                                <td><strong>{student.admissionNo}</strong></td>
                                <td>{student.firstName} {student.lastName}</td>
                                <td>{student.class}</td>
                                <td>{student.section}</td>
                                <td>{stats.totalExams}</td>
                                <td>
                                  <span className={`badge ${stats.average >= 75 ? 'bg-success' : stats.average >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                                    {stats.average}%
                                  </span>
                                </td>
                                <td className="text-success">{stats.passed}</td>
                                <td className="text-danger">{stats.failed}</td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => setSelectedStudent(student.id.toString())}
                                  >
                                    <i className="bi bi-eye"></i> View Report
                                  </button>
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

          {selectedStudentData && studentStats && (
            <div className="row mt-4">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="text-center mb-4">
                      <h3>Report Card</h3>
                      <h5>{selectedStudentData.firstName} {selectedStudentData.lastName}</h5>
                      <p className="text-muted">
                        Admission No: {selectedStudentData.admissionNo} | 
                        Class: {selectedStudentData.class} | 
                        Section: {selectedStudentData.section}
                      </p>
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-3">
                        <div className="card bg-primary text-white">
                          <div className="card-body text-center">
                            <h6>Total Exams</h6>
                            <h3>{studentStats.totalExams}</h3>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="card bg-success text-white">
                          <div className="card-body text-center">
                            <h6>Average %</h6>
                            <h3>{studentStats.average}%</h3>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="card bg-info text-white">
                          <div className="card-body text-center">
                            <h6>Passed</h6>
                            <h3>{studentStats.passed}</h3>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="card bg-danger text-white">
                          <div className="card-body text-center">
                            <h6>Failed</h6>
                            <h3>{studentStats.failed}</h3>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h5 className="mb-3">Exam Results</h5>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>Exam</th>
                            <th>Subject</th>
                            <th>Marks Obtained</th>
                            <th>Max Marks</th>
                            <th>Percentage</th>
                            <th>Grade</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentResults.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="text-center text-muted">
                                No results found for this student
                              </td>
                            </tr>
                          ) : (
                            studentResults.map((result) => (
                              <tr key={result.id}>
                                <td>{result.examName || '-'}</td>
                                <td>{result.subjectName || '-'}</td>
                                <td>{result.marks}</td>
                                <td>{result.maxMarks}</td>
                                <td>{result.percentage}%</td>
                                <td>
                                  <span className={`badge ${result.grade === 'F' ? 'bg-danger' : 'bg-success'}`}>
                                    {result.grade}
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge ${result.status === 'Pass' ? 'bg-success' : 'bg-danger'}`}>
                                    {result.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="text-end mt-3">
                      <button
                        className="btn btn-primary"
                        onClick={() => window.print()}
                      >
                        <i className="bi bi-printer"></i> Print Report Card
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ReportCards;

