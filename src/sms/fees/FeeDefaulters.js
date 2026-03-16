import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const FeeDefaulters = () => {
  const { 
    fees,
    students,
    classes,
    sections,
    academicYears
  } = useSchool();

  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [daysOverdue, setDaysOverdue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Get defaulters
  const getDefaulters = () => {
    const today = new Date();
    const defaulters = [];

    fees.forEach(fee => {
      if (fee.status === 'Pending' && fee.dueDate) {
        const dueDate = new Date(fee.dueDate);
        const days = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        
        if (days > 0) {
          const student = students.find(s => s.id === fee.studentId);
          if (student) {
            const matchesYear = !selectedAcademicYear || fee.academicYearId === parseInt(selectedAcademicYear);
            const matchesClass = !selectedClass || fee.class === selectedClass;
            const matchesSection = !selectedSection || fee.section === selectedSection;
            const matchesDays = daysOverdue === 0 || days >= daysOverdue;
            const matchesSearch = !searchTerm || 
              student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());

            if (matchesYear && matchesClass && matchesSection && matchesDays && matchesSearch) {
              // Check if student already in defaulters list
              const existingIndex = defaulters.findIndex(d => d.studentId === fee.studentId);
              if (existingIndex >= 0) {
                defaulters[existingIndex].totalAmount += fee.amount || 0;
                defaulters[existingIndex].fees.push(fee);
                if (days > defaulters[existingIndex].maxDaysOverdue) {
                  defaulters[existingIndex].maxDaysOverdue = days;
                }
              } else {
                defaulters.push({
                  studentId: fee.studentId,
                  studentName: fee.studentName,
                  admissionNo: student.admissionNo,
                  class: fee.class,
                  section: fee.section,
                  totalAmount: fee.amount || 0,
                  fees: [fee],
                  maxDaysOverdue: days,
                  oldestDueDate: fee.dueDate
                });
              }
            }
          }
        }
      }
    });

    return defaulters.sort((a, b) => b.maxDaysOverdue - a.maxDaysOverdue);
  };

  const defaulters = getDefaulters();

  // Statistics
  const stats = {
    total: defaulters.length,
    totalAmount: defaulters.reduce((sum, d) => sum + d.totalAmount, 0),
    avgDaysOverdue: defaulters.length > 0 
      ? (defaulters.reduce((sum, d) => sum + d.maxDaysOverdue, 0) / defaulters.length).toFixed(1)
      : 0
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Fee Defaulters</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/fees">Fees</Link></li>
              <li className="breadcrumb-item active">Fee Defaulters</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row mb-4">
            <div className="col-lg-4 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Total Defaulters</h6>
                  <h4 className="mb-0 text-danger">{stats.total}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Total Outstanding</h6>
                  <h4 className="mb-0 text-warning">₹{stats.totalAmount.toLocaleString()}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Avg Days Overdue</h6>
                  <h4 className="mb-0 text-primary">{stats.avgDaysOverdue}</h4>
                </div>
              </div>
            </div>
          </div>

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
                    <div className="col-md-2">
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
                    <div className="col-md-2">
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
                    <div className="col-md-2">
                      <label className="form-label">Days Overdue (Min)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={daysOverdue}
                        onChange={(e) => setDaysOverdue(parseInt(e.target.value) || 0)}
                        min="0"
                        placeholder="0"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Search</label>
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
                  <h5 className="card-title">Defaulters List</h5>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Admission No</th>
                          <th>Student Name</th>
                          <th>Class</th>
                          <th>Section</th>
                          <th>Total Outstanding</th>
                          <th>No. of Fees</th>
                          <th>Days Overdue</th>
                          <th>Oldest Due Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {defaulters.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="text-center text-muted">
                              No defaulters found
                            </td>
                          </tr>
                        ) : (
                          defaulters.map((defaulter) => (
                            <tr key={defaulter.studentId}>
                              <td><strong>{defaulter.admissionNo}</strong></td>
                              <td>{defaulter.studentName}</td>
                              <td>{defaulter.class}</td>
                              <td>{defaulter.section}</td>
                              <td className="text-danger">
                                <strong>₹{defaulter.totalAmount.toLocaleString()}</strong>
                              </td>
                              <td>{defaulter.fees.length}</td>
                              <td>
                                <span className={`badge ${
                                  defaulter.maxDaysOverdue > 90 ? 'bg-danger' :
                                  defaulter.maxDaysOverdue > 30 ? 'bg-warning' :
                                  'bg-info'
                                }`}>
                                  {defaulter.maxDaysOverdue} days
                                </span>
                              </td>
                              <td>{defaulter.oldestDueDate ? new Date(defaulter.oldestDueDate).toLocaleDateString() : '-'}</td>
                              <td>
                                <Link
                                  to={`/fees?studentId=${defaulter.studentId}`}
                                  className="btn btn-sm btn-primary"
                                >
                                  <i className="bi bi-eye"></i> View Fees
                                </Link>
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

export default FeeDefaulters;

