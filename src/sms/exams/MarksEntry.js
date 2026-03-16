import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const MarksEntry = () => {
  const { 
    students, 
    classes, 
    sections,
    subjects,
    exams,
    academicYears,
    results,
    addResult,
    updateResult
  } = useSchool();

  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [marksData, setMarksData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Get current academic year
  const currentAcademicYear = academicYears.find(ay => ay.isCurrent) || academicYears[0];
  const currentYearId = currentAcademicYear?.id;

  // Filter sections based on selected class
  const selectedClassObj = classes.find(c => c.name === selectedClass);
  const availableSections = selectedClass && selectedClassObj
    ? sections.filter(s => s.className === selectedClass)
    : [];

  // Get selected exam data
  const selectedExamData = exams.find(e => e.id === parseInt(selectedExam));

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

  // Load existing results for selected exam
  useEffect(() => {
    if (selectedExam) {
      const existingResults = results.filter(r => r.examId === parseInt(selectedExam));
      const initialData = {};
      existingResults.forEach(result => {
        initialData[result.studentId] = {
          marks: result.marks || 0,
          remarks: result.remarks || ''
        };
      });
      setMarksData(initialData);
    } else {
      setMarksData({});
    }
  }, [selectedExam, results]);

  // Set default academic year
  useEffect(() => {
    if (currentYearId && !selectedAcademicYear) {
      setSelectedAcademicYear(currentYearId);
    }
  }, [currentYearId, selectedAcademicYear]);

  // Auto-select class when exam is selected
  useEffect(() => {
    if (selectedExamData && !selectedClass) {
      setSelectedClass(selectedExamData.class);
    }
  }, [selectedExamData, selectedClass]);

  const handleMarksChange = (studentId, field, value) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: field === 'marks' ? parseFloat(value) || 0 : value
      }
    }));
  };

  const calculateGrade = (marks, maxMarks) => {
    if (!maxMarks || maxMarks === 0) return '-';
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
  };

  const handleBulkMarks = (marks) => {
    if (!selectedExamData) return;
    const newData = {};
    filteredStudents.forEach(student => {
      newData[student.id] = {
        marks: parseFloat(marks) || 0,
        remarks: marksData[student.id]?.remarks || ''
      };
    });
    setMarksData(prev => ({ ...prev, ...newData }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedExam || !selectedClass) {
      alert('Please select exam and class');
      return;
    }

    if (!selectedExamData) {
      alert('Please select a valid exam');
      return;
    }

    // Save results for each student
    filteredStudents.forEach(student => {
      const studentMarks = marksData[student.id]?.marks || 0;
      const remarks = marksData[student.id]?.remarks || '';
      
      // Check if result already exists
      const existingResult = results.find(
        r => r.examId === parseInt(selectedExam) && r.studentId === student.id
      );

      const resultData = {
        examId: parseInt(selectedExam),
        examName: selectedExamData.name,
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        admissionNo: student.admissionNo,
        className: selectedClass,
        sectionName: selectedSection || '',
        marks: studentMarks,
        maxMarks: selectedExamData.maxMarks,
        passingMarks: selectedExamData.passingMarks,
        percentage: selectedExamData.maxMarks > 0 ? ((studentMarks / selectedExamData.maxMarks) * 100).toFixed(2) : 0,
        grade: calculateGrade(studentMarks, selectedExamData.maxMarks),
        status: studentMarks >= selectedExamData.passingMarks ? 'Pass' : 'Fail',
        remarks: remarks
      };

      if (existingResult) {
        updateResult(existingResult.id, resultData);
      } else {
        addResult(resultData);
      }
    });

    alert('Marks saved successfully!');
  };

  // Calculate statistics
  const getStats = () => {
    if (!selectedExamData) return { total: 0, passed: 0, failed: 0, average: 0 };
    
    const studentMarks = filteredStudents.map(s => marksData[s.id]?.marks || 0);
    const total = studentMarks.length;
    const passed = studentMarks.filter(m => m >= selectedExamData.passingMarks).length;
    const failed = total - passed;
    const average = total > 0 ? (studentMarks.reduce((a, b) => a + b, 0) / total).toFixed(2) : 0;

    return { total, passed, failed, average };
  };

  const stats = getStats();

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Marks Entry</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/exams">Exams</Link></li>
              <li className="breadcrumb-item active">Marks Entry</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row mb-4">
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Total Students</h6>
                  <h4 className="mb-0">{stats.total}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Passed</h6>
                  <h4 className="mb-0 text-success">{stats.passed}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Failed</h6>
                  <h4 className="mb-0 text-danger">{stats.failed}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Average Marks</h6>
                  <h4 className="mb-0 text-primary">{stats.average}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Enter Marks</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
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
                          <option value="">Select Academic Year</option>
                          {academicYears.map(ay => (
                            <option key={ay.id} value={ay.id}>
                              {ay.name} {ay.isCurrent && '(Current)'}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">
                          Exam <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={selectedExam}
                          onChange={(e) => setSelectedExam(e.target.value)}
                        >
                          <option value="">Select Exam</option>
                          {exams.map(exam => (
                            <option key={exam.id} value={exam.id}>
                              {exam.name} - {exam.class} - {exam.subject}
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
                          <option value="">Select Class</option>
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
                    </div>

                    {selectedExamData && (
                      <div className="alert alert-info mb-3">
                        <strong>Exam Details:</strong> {selectedExamData.name} | 
                        Max Marks: {selectedExamData.maxMarks} | 
                        Passing Marks: {selectedExamData.passingMarks}
                      </div>
                    )}

                    {selectedClass && (
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search by name or admission number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          {selectedExamData && (
                            <div className="input-group">
                              <input
                                type="number"
                                className="form-control"
                                placeholder="Bulk marks for all students"
                                max={selectedExamData.maxMarks}
                                min={0}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleBulkMarks(e.target.value);
                                    e.target.value = '';
                                  }
                                }}
                              />
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={(e) => {
                                  const input = e.target.previousElementSibling;
                                  handleBulkMarks(input.value);
                                  input.value = '';
                                }}
                              >
                                Apply to All
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {filteredStudents.length > 0 && selectedExamData && (
                      <div className="table-responsive">
                        <table className="table table-hover table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th style={{ width: '50px' }}>#</th>
                              <th>Admission No</th>
                              <th>Student Name</th>
                              <th style={{ width: '150px' }}>Marks Obtained</th>
                              <th style={{ width: '100px' }}>Max Marks</th>
                              <th style={{ width: '100px' }}>Percentage</th>
                              <th style={{ width: '100px' }}>Grade</th>
                              <th style={{ width: '100px' }}>Status</th>
                              <th>Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredStudents.map((student, index) => {
                              const marks = marksData[student.id]?.marks || 0;
                              const grade = calculateGrade(marks, selectedExamData.maxMarks);
                              const status = marks >= selectedExamData.passingMarks ? 'Pass' : 'Fail';
                              const percentage = selectedExamData.maxMarks > 0 
                                ? ((marks / selectedExamData.maxMarks) * 100).toFixed(2) 
                                : 0;

                              return (
                                <tr key={student.id}>
                                  <td>{index + 1}</td>
                                  <td><strong>{student.admissionNo}</strong></td>
                                  <td>{student.firstName} {student.lastName}</td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control form-control-sm"
                                      value={marks}
                                      onChange={(e) => handleMarksChange(student.id, 'marks', e.target.value)}
                                      max={selectedExamData.maxMarks}
                                      min={0}
                                      step="0.01"
                                    />
                                  </td>
                                  <td className="text-center">{selectedExamData.maxMarks}</td>
                                  <td className="text-center">{percentage}%</td>
                                  <td className="text-center">
                                    <span className={`badge ${grade === 'F' ? 'bg-danger' : 'bg-success'}`}>
                                      {grade}
                                    </span>
                                  </td>
                                  <td className="text-center">
                                    <span className={`badge ${status === 'Pass' ? 'bg-success' : 'bg-danger'}`}>
                                      {status}
                                    </span>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      placeholder="Remarks"
                                      value={marksData[student.id]?.remarks || ''}
                                      onChange={(e) => handleMarksChange(student.id, 'remarks', e.target.value)}
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <div className="text-end mt-3">
                          <button type="submit" className="btn btn-primary btn-lg">
                            <i className="bi bi-save"></i> Save Marks
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedClass && filteredStudents.length === 0 && (
                      <div className="alert alert-info">
                        No students found for the selected class and section.
                      </div>
                    )}
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

export default MarksEntry;

