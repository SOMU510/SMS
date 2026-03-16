import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const FeeReports = () => {
  const { 
    fees,
    students,
    classes,
    sections,
    academicYears,
    feeCategories
  } = useSchool();

  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [reportType, setReportType] = useState('summary'); // 'summary', 'category', 'student', 'collection'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  // Filter fees
  let filteredFees = fees;
  if (selectedAcademicYear) {
    filteredFees = filteredFees.filter(f => f.academicYearId === parseInt(selectedAcademicYear));
  }
  if (selectedClass) {
    filteredFees = filteredFees.filter(f => f.class === selectedClass);
  }
  if (selectedSection) {
    const sectionName = sections.find(s => s.id === parseInt(selectedSection))?.name;
    filteredFees = filteredFees.filter(f => f.section === sectionName);
  }
  if (startDate) {
    filteredFees = filteredFees.filter(f => f.paidDate && f.paidDate >= startDate);
  }
  if (endDate) {
    filteredFees = filteredFees.filter(f => f.paidDate && f.paidDate <= endDate);
  }
  if (selectedCategory !== 'All') {
    filteredFees = filteredFees.filter(f => f.feeType === selectedCategory);
  }

  // Summary Report
  const getSummaryReport = () => {
    const total = filteredFees.length;
    const paid = filteredFees.filter(f => f.status === 'Paid').length;
    const pending = filteredFees.filter(f => f.status === 'Pending').length;
    const totalAmount = filteredFees.reduce((sum, f) => sum + (f.amount || 0), 0);
    const paidAmount = filteredFees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + (f.amount || 0), 0);
    const pendingAmount = filteredFees.filter(f => f.status === 'Pending').reduce((sum, f) => sum + (f.amount || 0), 0);

    return {
      total,
      paid,
      pending,
      totalAmount,
      paidAmount,
      pendingAmount,
      collectionRate: totalAmount > 0 ? ((paidAmount / totalAmount) * 100).toFixed(1) : 0
    };
  };

  // Category-wise Report
  const getCategoryReport = () => {
    const categoryStats = {};
    filteredFees.forEach(fee => {
      const category = fee.feeType || 'Other';
      if (!categoryStats[category]) {
        categoryStats[category] = {
          total: 0,
          paid: 0,
          pending: 0,
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0
        };
      }
      categoryStats[category].total++;
      categoryStats[category].totalAmount += fee.amount || 0;
      if (fee.status === 'Paid') {
        categoryStats[category].paid++;
        categoryStats[category].paidAmount += fee.amount || 0;
      } else {
        categoryStats[category].pending++;
        categoryStats[category].pendingAmount += fee.amount || 0;
      }
    });

    return Object.keys(categoryStats).map(category => ({
      category,
      ...categoryStats[category]
    }));
  };

  // Collection Report (Daily/Monthly)
  const getCollectionReport = () => {
    const collectionStats = {};
    filteredFees.filter(f => f.status === 'Paid' && f.paidDate).forEach(fee => {
      const date = fee.paidDate;
      if (!collectionStats[date]) {
        collectionStats[date] = {
          date,
          count: 0,
          amount: 0
        };
      }
      collectionStats[date].count++;
      collectionStats[date].amount += fee.amount || 0;
    });

    return Object.values(collectionStats)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Student-wise Report
  const getStudentReport = () => {
    const studentStats = {};
    filteredFees.forEach(fee => {
      if (!studentStats[fee.studentId]) {
        studentStats[fee.studentId] = {
          studentId: fee.studentId,
          studentName: fee.studentName,
          admissionNo: fee.admissionNo,
          class: fee.class,
          section: fee.section,
          totalFees: 0,
          paidFees: 0,
          pendingFees: 0,
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0
        };
      }
      studentStats[fee.studentId].totalFees++;
      studentStats[fee.studentId].totalAmount += fee.amount || 0;
      if (fee.status === 'Paid') {
        studentStats[fee.studentId].paidFees++;
        studentStats[fee.studentId].paidAmount += fee.amount || 0;
      } else {
        studentStats[fee.studentId].pendingFees++;
        studentStats[fee.studentId].pendingAmount += fee.amount || 0;
      }
    });

    return Object.values(studentStats);
  };

  const summary = getSummaryReport();
  const categoryReport = getCategoryReport();
  const collectionReport = getCollectionReport();
  const studentReport = getStudentReport();

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Fee Reports</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/fees">Fees</Link></li>
              <li className="breadcrumb-item active">Reports</li>
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
                    <div className="col-md-2">
                      <label className="form-label">Report Type</label>
                      <select
                        className="form-select"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                      >
                        <option value="summary">Summary</option>
                        <option value="category">Category-wise</option>
                        <option value="student">Student-wise</option>
                        <option value="collection">Collection Report</option>
                      </select>
                    </div>
                    <div className="col-md-2">
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
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  {reportType === 'category' && (
                    <div className="row mt-3">
                      <div className="col-md-3">
                        <label className="form-label">Fee Category</label>
                        <select
                          className="form-select"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                          <option value="All">All Categories</option>
                          {feeCategories.map(category => (
                            <option key={category.id} value={category.name}>{category.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {reportType === 'summary' && (
            <div className="row mb-4">
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body text-center">
                    <h6 className="text-muted mb-1">Total Fees</h6>
                    <h4 className="mb-0">{summary.total}</h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body text-center">
                    <h6 className="text-muted mb-1">Paid</h6>
                    <h4 className="mb-0 text-success">{summary.paid}</h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body text-center">
                    <h6 className="text-muted mb-1">Pending</h6>
                    <h4 className="mb-0 text-warning">{summary.pending}</h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body text-center">
                    <h6 className="text-muted mb-1">Collection Rate</h6>
                    <h4 className="mb-0 text-primary">{summary.collectionRate}%</h4>
                  </div>
                </div>
              </div>
            </div>
          )}

          {reportType === 'summary' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Summary Report</h5>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>Metric</th>
                            <th>Count</th>
                            <th>Amount (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>Total Fees</strong></td>
                            <td>{summary.total}</td>
                            <td>₹{summary.totalAmount.toLocaleString()}</td>
                          </tr>
                          <tr className="table-success">
                            <td><strong>Paid</strong></td>
                            <td>{summary.paid}</td>
                            <td>₹{summary.paidAmount.toLocaleString()}</td>
                          </tr>
                          <tr className="table-warning">
                            <td><strong>Pending</strong></td>
                            <td>{summary.pending}</td>
                            <td>₹{summary.pendingAmount.toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td><strong>Collection Rate</strong></td>
                            <td colSpan="2">{summary.collectionRate}%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {reportType === 'category' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Category-wise Report</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Total</th>
                            <th>Paid</th>
                            <th>Pending</th>
                            <th>Total Amount</th>
                            <th>Paid Amount</th>
                            <th>Pending Amount</th>
                            <th>Collection %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categoryReport.length === 0 ? (
                            <tr>
                              <td colSpan="8" className="text-center text-muted">
                                No data available
                              </td>
                            </tr>
                          ) : (
                            categoryReport.map((cat, index) => {
                              const collectionRate = cat.totalAmount > 0 
                                ? ((cat.paidAmount / cat.totalAmount) * 100).toFixed(1) 
                                : 0;
                              return (
                                <tr key={index}>
                                  <td><strong>{cat.category}</strong></td>
                                  <td>{cat.total}</td>
                                  <td className="text-success">{cat.paid}</td>
                                  <td className="text-warning">{cat.pending}</td>
                                  <td>₹{cat.totalAmount.toLocaleString()}</td>
                                  <td className="text-success">₹{cat.paidAmount.toLocaleString()}</td>
                                  <td className="text-warning">₹{cat.pendingAmount.toLocaleString()}</td>
                                  <td>
                                    <span className={`badge ${parseFloat(collectionRate) >= 75 ? 'bg-success' : parseFloat(collectionRate) >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                                      {collectionRate}%
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
          )}

          {reportType === 'student' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Student-wise Report</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Admission No</th>
                            <th>Student Name</th>
                            <th>Class</th>
                            <th>Section</th>
                            <th>Total Fees</th>
                            <th>Paid</th>
                            <th>Pending</th>
                            <th>Total Amount</th>
                            <th>Paid Amount</th>
                            <th>Pending Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentReport.length === 0 ? (
                            <tr>
                              <td colSpan="10" className="text-center text-muted">
                                No data available
                              </td>
                            </tr>
                          ) : (
                            studentReport.map((student) => (
                              <tr key={student.studentId}>
                                <td><strong>{student.admissionNo}</strong></td>
                                <td>{student.studentName}</td>
                                <td>{student.class}</td>
                                <td>{student.section}</td>
                                <td>{student.totalFees}</td>
                                <td className="text-success">{student.paidFees}</td>
                                <td className="text-warning">{student.pendingFees}</td>
                                <td>₹{student.totalAmount.toLocaleString()}</td>
                                <td className="text-success">₹{student.paidAmount.toLocaleString()}</td>
                                <td className="text-warning">₹{student.pendingAmount.toLocaleString()}</td>
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

          {reportType === 'collection' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Collection Report</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>No. of Payments</th>
                            <th>Total Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {collectionReport.length === 0 ? (
                            <tr>
                              <td colSpan="3" className="text-center text-muted">
                                No collection data available
                              </td>
                            </tr>
                          ) : (
                            collectionReport.map((collection, index) => (
                              <tr key={index}>
                                <td>{new Date(collection.date).toLocaleDateString()}</td>
                                <td>{collection.count}</td>
                                <td className="text-success">
                                  <strong>₹{collection.amount.toLocaleString()}</strong>
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
          )}
        </section>
      </div>
    </main>
  );
};

export default FeeReports;

