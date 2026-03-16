import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const FeeFinanceReports = () => {
  const { 
    fees,
    feeCategories,
    students,
    classes,
    academicYears
  } = useSchool();

  const [reportType, setReportType] = useState('summary');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter fees
  let filteredFees = fees;
  if (selectedClass !== 'All') {
    filteredFees = filteredFees.filter(f => f.class === selectedClass);
  }
  if (selectedCategory !== 'All') {
    filteredFees = filteredFees.filter(f => f.feeType === selectedCategory);
  }
  if (selectedAcademicYear !== 'All') {
    filteredFees = filteredFees.filter(f => f.academicYearId === parseInt(selectedAcademicYear));
  }
  if (startDate) {
    filteredFees = filteredFees.filter(f => f.dueDate && f.dueDate >= startDate);
  }
  if (endDate) {
    filteredFees = filteredFees.filter(f => f.dueDate && f.dueDate <= endDate);
  }

  // Summary Report
  const getSummaryReport = () => {
    const total = filteredFees.length;
    const paid = filteredFees.filter(f => f.status === 'Paid').length;
    const pending = filteredFees.filter(f => f.status === 'Pending').length;
    const totalAmount = filteredFees.reduce((sum, f) => sum + (f.amount || 0), 0);
    const paidAmount = filteredFees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + (f.amount || 0), 0);
    const pendingAmount = filteredFees.filter(f => f.status === 'Pending').reduce((sum, f) => sum + (f.amount || 0), 0);
    const collectionRate = totalAmount > 0 ? ((paidAmount / totalAmount) * 100).toFixed(1) : 0;

    return {
      total,
      paid,
      pending,
      totalAmount,
      paidAmount,
      pendingAmount,
      collectionRate
    };
  };

  // Category-wise Report
  const getCategoryReport = () => {
    const categoryStats = {};
    
    filteredFees.forEach(fee => {
      const category = fee.feeType || 'Other';
      if (!categoryStats[category]) {
        categoryStats[category] = {
          category,
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

    return Object.values(categoryStats);
  };

  // Class-wise Report
  const getClassReport = () => {
    const classStats = {};
    
    filteredFees.forEach(fee => {
      const className = fee.class || 'Unknown';
      if (!classStats[className]) {
        classStats[className] = {
          className,
          total: 0,
          paid: 0,
          pending: 0,
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0
        };
      }
      
      classStats[className].total++;
      classStats[className].totalAmount += fee.amount || 0;
      if (fee.status === 'Paid') {
        classStats[className].paid++;
        classStats[className].paidAmount += fee.amount || 0;
      } else {
        classStats[className].pending++;
        classStats[className].pendingAmount += fee.amount || 0;
      }
    });

    return Object.values(classStats).map(stat => ({
      ...stat,
      collectionRate: stat.totalAmount > 0 ? ((stat.paidAmount / stat.totalAmount) * 100).toFixed(1) : 0
    }));
  };

  // Monthly Collection Report
  const getMonthlyCollectionReport = () => {
    const monthlyStats = {};
    
    filteredFees
      .filter(f => f.status === 'Paid' && f.paidDate)
      .forEach(fee => {
        const date = new Date(fee.paidDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        if (!monthlyStats[monthKey]) {
          monthlyStats[monthKey] = {
            month: monthName,
            count: 0,
            amount: 0
          };
        }
        
        monthlyStats[monthKey].count++;
        monthlyStats[monthKey].amount += fee.amount || 0;
      });

    return Object.values(monthlyStats)
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  // Payment Method Report
  const getPaymentMethodReport = () => {
    const methodStats = {};
    
    filteredFees
      .filter(f => f.status === 'Paid')
      .forEach(fee => {
        const method = fee.paymentMethod || 'Unknown';
        if (!methodStats[method]) {
          methodStats[method] = {
            method,
            count: 0,
            amount: 0
          };
        }
        
        methodStats[method].count++;
        methodStats[method].amount += fee.amount || 0;
      });

    return Object.values(methodStats);
  };

  const summary = getSummaryReport();
  const categoryReport = getCategoryReport();
  const classReport = getClassReport();
  const monthlyReport = getMonthlyCollectionReport();
  const paymentMethodReport = getPaymentMethodReport();

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Fee & Finance Reports</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/reports">Reports</Link></li>
              <li className="breadcrumb-item active">Fee & Finance Reports</li>
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
                      <label className="form-label">Report Type</label>
                      <select
                        className="form-select"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                      >
                        <option value="summary">Summary</option>
                        <option value="category">Category-wise</option>
                        <option value="class">Class-wise</option>
                        <option value="monthly">Monthly Collection</option>
                        <option value="payment">Payment Method</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Class</label>
                      <select
                        className="form-select"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                      >
                        <option value="All">All Classes</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.name}>{cls.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="All">All Categories</option>
                        {feeCategories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Academic Year</label>
                      <select
                        className="form-select"
                        value={selectedAcademicYear}
                        onChange={(e) => setSelectedAcademicYear(e.target.value)}
                      >
                        <option value="All">All Years</option>
                        {academicYears.map(ay => (
                          <option key={ay.id} value={ay.id}>{ay.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Date Range</label>
                      <div className="d-flex gap-2">
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          placeholder="Start"
                        />
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          placeholder="End"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {reportType === 'summary' && (
            <>
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
                              <td colSpan="2">
                                <span className={`badge ${parseFloat(summary.collectionRate) >= 75 ? 'bg-success' : parseFloat(summary.collectionRate) >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                                  {summary.collectionRate}%
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
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

          {reportType === 'class' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Class-wise Report</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Class</th>
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
                          {classReport.length === 0 ? (
                            <tr>
                              <td colSpan="8" className="text-center text-muted">
                                No data available
                              </td>
                            </tr>
                          ) : (
                            classReport.map((classData, index) => (
                              <tr key={index}>
                                <td><strong>{classData.className}</strong></td>
                                <td>{classData.total}</td>
                                <td className="text-success">{classData.paid}</td>
                                <td className="text-warning">{classData.pending}</td>
                                <td>₹{classData.totalAmount.toLocaleString()}</td>
                                <td className="text-success">₹{classData.paidAmount.toLocaleString()}</td>
                                <td className="text-warning">₹{classData.pendingAmount.toLocaleString()}</td>
                                <td>
                                  <span className={`badge ${parseFloat(classData.collectionRate) >= 75 ? 'bg-success' : parseFloat(classData.collectionRate) >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                                    {classData.collectionRate}%
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
          )}

          {reportType === 'monthly' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Monthly Collection Report</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Month</th>
                            <th>No. of Payments</th>
                            <th>Total Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthlyReport.length === 0 ? (
                            <tr>
                              <td colSpan="3" className="text-center text-muted">
                                No data available
                              </td>
                            </tr>
                          ) : (
                            monthlyReport.map((month, index) => (
                              <tr key={index}>
                                <td><strong>{month.month}</strong></td>
                                <td>{month.count}</td>
                                <td className="text-success">
                                  <strong>₹{month.amount.toLocaleString()}</strong>
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

          {reportType === 'payment' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Payment Method Report</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Payment Method</th>
                            <th>No. of Payments</th>
                            <th>Total Amount</th>
                            <th>Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentMethodReport.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="text-center text-muted">
                                No data available
                              </td>
                            </tr>
                          ) : (
                            paymentMethodReport.map((method, index) => {
                              const totalPaid = summary.paidAmount;
                              const percentage = totalPaid > 0 
                                ? ((method.amount / totalPaid) * 100).toFixed(1) 
                                : 0;
                              return (
                                <tr key={index}>
                                  <td><strong>{method.method}</strong></td>
                                  <td>{method.count}</td>
                                  <td className="text-success">₹{method.amount.toLocaleString()}</td>
                                  <td>
                                    <div className="progress" style={{ height: '20px' }}>
                                      <div 
                                        className="progress-bar" 
                                        role="progressbar" 
                                        style={{ width: `${percentage}%` }}
                                      >
                                        {percentage}%
                                      </div>
                                    </div>
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
        </section>
      </div>
    </main>
  );
};

export default FeeFinanceReports;

