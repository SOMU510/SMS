import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const PerformanceAnalytics = () => {
  const { 
    students, 
    classes, 
    sections,
    academicYears,
    results,
    exams,
    subjects
  } = useSchool();

  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [analyticsType, setAnalyticsType] = useState('class'); // 'class', 'subject', 'student'

  // Get current academic year
  const currentAcademicYear = academicYears.find(ay => ay.isCurrent) || academicYears[0];
  const currentYearId = currentAcademicYear?.id;

  // Filter sections based on selected class
  const selectedClassObj = classes.find(c => c.name === selectedClass);
  const availableSections = selectedClass && selectedClassObj
    ? sections.filter(s => s.className === selectedClass)
    : [];

  // Set default academic year
  useEffect(() => {
    if (currentYearId && !selectedAcademicYear) {
      setSelectedAcademicYear(currentYearId);
    }
  }, [currentYearId, selectedAcademicYear]);

  // Filter results
  let filteredResults = results;
  if (selectedClass) {
    filteredResults = filteredResults.filter(r => r.className === selectedClass);
  }
  if (selectedSection) {
    const sectionName = sections.find(s => s.id === parseInt(selectedSection))?.name;
    filteredResults = filteredResults.filter(r => r.sectionName === sectionName);
  }

  // Class Performance Analytics
  const getClassPerformance = () => {
    const classStats = {};
    filteredResults.forEach(result => {
      const className = result.className || 'Unknown';
      if (!classStats[className]) {
        classStats[className] = {
          totalStudents: new Set(),
          totalExams: 0,
          totalMarks: 0,
          obtainedMarks: 0,
          passed: 0,
          failed: 0
        };
      }
      classStats[className].totalStudents.add(result.studentId);
      classStats[className].totalExams++;
      classStats[className].totalMarks += result.maxMarks || 0;
      classStats[className].obtainedMarks += result.marks || 0;
      if (result.status === 'Pass') classStats[className].passed++;
      else classStats[className].failed++;
    });

    return Object.keys(classStats).map(className => {
      const stats = classStats[className];
      const average = stats.totalMarks > 0 
        ? ((stats.obtainedMarks / stats.totalMarks) * 100).toFixed(2) 
        : 0;
      const passRate = stats.totalExams > 0 
        ? ((stats.passed / stats.totalExams) * 100).toFixed(2) 
        : 0;

      return {
        className,
        totalStudents: stats.totalStudents.size,
        totalExams: stats.totalExams,
        average: parseFloat(average),
        passRate: parseFloat(passRate),
        passed: stats.passed,
        failed: stats.failed
      };
    });
  };

  // Subject Performance Analytics
  const getSubjectPerformance = () => {
    const subjectStats = {};
    filteredResults.forEach(result => {
      const subjectName = result.subjectName || 'Unknown';
      if (!subjectStats[subjectName]) {
        subjectStats[subjectName] = {
          totalExams: 0,
          totalMarks: 0,
          obtainedMarks: 0,
          passed: 0,
          failed: 0
        };
      }
      subjectStats[subjectName].totalExams++;
      subjectStats[subjectName].totalMarks += result.maxMarks || 0;
      subjectStats[subjectName].obtainedMarks += result.marks || 0;
      if (result.status === 'Pass') subjectStats[subjectName].passed++;
      else subjectStats[subjectName].failed++;
    });

    return Object.keys(subjectStats).map(subjectName => {
      const stats = subjectStats[subjectName];
      const average = stats.totalMarks > 0 
        ? ((stats.obtainedMarks / stats.totalMarks) * 100).toFixed(2) 
        : 0;
      const passRate = stats.totalExams > 0 
        ? ((stats.passed / stats.totalExams) * 100).toFixed(2) 
        : 0;

      return {
        subjectName,
        totalExams: stats.totalExams,
        average: parseFloat(average),
        passRate: parseFloat(passRate),
        passed: stats.passed,
        failed: stats.failed
      };
    });
  };

  // Top/Bottom Students
  const getTopStudents = (limit = 10) => {
    const studentStats = {};
    filteredResults.forEach(result => {
      if (!studentStats[result.studentId]) {
        studentStats[result.studentId] = {
          studentName: result.studentName,
          admissionNo: result.admissionNo,
          className: result.className,
          totalMarks: 0,
          obtainedMarks: 0,
          examCount: 0
        };
      }
      studentStats[result.studentId].totalMarks += result.maxMarks || 0;
      studentStats[result.studentId].obtainedMarks += result.marks || 0;
      studentStats[result.studentId].examCount++;
    });

    return Object.values(studentStats)
      .map(stats => ({
        ...stats,
        average: stats.totalMarks > 0 
          ? ((stats.obtainedMarks / stats.totalMarks) * 100).toFixed(2) 
          : 0
      }))
      .sort((a, b) => parseFloat(b.average) - parseFloat(a.average))
      .slice(0, limit);
  };

  const classPerformance = getClassPerformance();
  const subjectPerformance = getSubjectPerformance();
  const topStudents = getTopStudents(10);
  const bottomStudents = getTopStudents(100).reverse().slice(0, 10);

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Performance Analytics</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/results">Results</Link></li>
              <li className="breadcrumb-item active">Performance Analytics</li>
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
                      <label className="form-label">Analytics Type</label>
                      <select
                        className="form-select"
                        value={analyticsType}
                        onChange={(e) => setAnalyticsType(e.target.value)}
                      >
                        <option value="class">Class Performance</option>
                        <option value="subject">Subject Performance</option>
                        <option value="student">Student Performance</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {analyticsType === 'class' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Class Performance</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Class</th>
                            <th>Total Students</th>
                            <th>Total Exams</th>
                            <th>Average %</th>
                            <th>Pass Rate</th>
                            <th>Passed</th>
                            <th>Failed</th>
                          </tr>
                        </thead>
                        <tbody>
                          {classPerformance.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="text-center text-muted">
                                No data available
                              </td>
                            </tr>
                          ) : (
                            classPerformance.map((stats, index) => (
                              <tr key={index}>
                                <td><strong>{stats.className}</strong></td>
                                <td>{stats.totalStudents}</td>
                                <td>{stats.totalExams}</td>
                                <td>
                                  <span className={`badge ${stats.average >= 75 ? 'bg-success' : stats.average >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                                    {stats.average}%
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge ${stats.passRate >= 75 ? 'bg-success' : stats.passRate >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                                    {stats.passRate}%
                                  </span>
                                </td>
                                <td className="text-success">{stats.passed}</td>
                                <td className="text-danger">{stats.failed}</td>
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
          )}

          {analyticsType === 'subject' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Subject Performance</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Subject</th>
                            <th>Total Exams</th>
                            <th>Average %</th>
                            <th>Pass Rate</th>
                            <th>Passed</th>
                            <th>Failed</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjectPerformance.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="text-center text-muted">
                                No data available
                              </td>
                            </tr>
                          ) : (
                            subjectPerformance.map((stats, index) => (
                              <tr key={index}>
                                <td><strong>{stats.subjectName}</strong></td>
                                <td>{stats.totalExams}</td>
                                <td>
                                  <span className={`badge ${stats.average >= 75 ? 'bg-success' : stats.average >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                                    {stats.average}%
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge ${stats.passRate >= 75 ? 'bg-success' : stats.passRate >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                                    {stats.passRate}%
                                  </span>
                                </td>
                                <td className="text-success">{stats.passed}</td>
                                <td className="text-danger">{stats.failed}</td>
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
          )}

          {analyticsType === 'student' && (
            <>
              <div className="row mb-3">
                <div className="col-lg-6">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Top 10 Students</h5>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Rank</th>
                              <th>Admission No</th>
                              <th>Student Name</th>
                              <th>Class</th>
                              <th>Average %</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topStudents.length === 0 ? (
                              <tr>
                                <td colSpan="5" className="text-center text-muted">
                                  No data available
                                </td>
                              </tr>
                            ) : (
                              topStudents.map((student, index) => (
                                <tr key={index}>
                                  <td><strong>#{index + 1}</strong></td>
                                  <td>{student.admissionNo}</td>
                                  <td>{student.studentName}</td>
                                  <td>{student.className}</td>
                                  <td>
                                    <span className={`badge ${parseFloat(student.average) >= 75 ? 'bg-success' : parseFloat(student.average) >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                                      {student.average}%
                                    </span>
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
                <div className="col-lg-6">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Bottom 10 Students</h5>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Rank</th>
                              <th>Admission No</th>
                              <th>Student Name</th>
                              <th>Class</th>
                              <th>Average %</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bottomStudents.length === 0 ? (
                              <tr>
                                <td colSpan="5" className="text-center text-muted">
                                  No data available
                                </td>
                              </tr>
                            ) : (
                              bottomStudents.map((student, index) => (
                                <tr key={index}>
                                  <td><strong>#{index + 1}</strong></td>
                                  <td>{student.admissionNo}</td>
                                  <td>{student.studentName}</td>
                                  <td>{student.className}</td>
                                  <td>
                                    <span className={`badge ${parseFloat(student.average) >= 75 ? 'bg-success' : parseFloat(student.average) >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                                      {student.average}%
                                    </span>
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
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default PerformanceAnalytics;

