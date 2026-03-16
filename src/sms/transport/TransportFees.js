import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const TransportFees = () => {
  const { 
    studentTransportAllocations,
    fees,
    students,
    routes,
    addFee,
    updateFee
  } = useSchool();

  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [feeAmount, setFeeAmount] = useState('');
  const [feeType, setFeeType] = useState('Monthly');
  const [dueDate, setDueDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Get active allocations
  const activeAllocations = studentTransportAllocations.filter(a => a.status === 'Active');

  // Filter allocations
  let filteredAllocations = activeAllocations;
  if (selectedRoute) {
    filteredAllocations = filteredAllocations.filter(a => a.routeId === parseInt(selectedRoute));
  }
  if (selectedClass) {
    filteredAllocations = filteredAllocations.filter(a => a.class === selectedClass);
  }
  if (searchTerm) {
    filteredAllocations = filteredAllocations.filter(a =>
      a.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Get transport fees
  const transportFees = fees.filter(f => f.feeType === 'Transport Fee' || f.feeType?.includes('Transport'));

  // Filter transport fees
  let filteredFees = transportFees;
  if (selectedRoute) {
    filteredFees = filteredFees.filter(f => {
      const allocation = activeAllocations.find(a => a.studentId === f.studentId);
      return allocation && allocation.routeId === parseInt(selectedRoute);
    });
  }
  if (filterStatus !== 'All') {
    filteredFees = filteredFees.filter(f => f.status === filterStatus);
  }

  const handleAssignFee = () => {
    if (!feeAmount || parseFloat(feeAmount) <= 0) {
      alert('Please enter a valid fee amount');
      return;
    }

    if (!dueDate) {
      alert('Please select a due date');
      return;
    }

    if (filteredAllocations.length === 0) {
      alert('No students selected for fee assignment');
      return;
    }

    const assignedCount = filteredAllocations.reduce((count, allocation) => {
      const student = students.find(s => s.id === allocation.studentId);
      if (!student) return count;

      // Check if fee already exists
      const existing = fees.find(
        f => f.studentId === allocation.studentId &&
             f.feeType === 'Transport Fee' &&
             f.dueDate === dueDate
      );

      if (!existing) {
        const feeData = {
          studentId: allocation.studentId,
          studentName: allocation.studentName,
          admissionNo: allocation.admissionNo,
          class: allocation.class,
          section: allocation.section,
          feeType: 'Transport Fee',
          amount: parseFloat(feeAmount),
          dueDate: dueDate,
          status: 'Pending',
          paymentMethod: '',
          routeId: allocation.routeId,
          routeName: allocation.routeName
        };
        addFee(feeData);
        return count + 1;
      }
      return count;
    }, 0);

    alert(`Transport fee assigned to ${assignedCount} student(s) successfully!`);
    setFeeAmount('');
    setDueDate('');
  };

  // Statistics
  const stats = {
    totalAllocations: activeAllocations.length,
    totalFees: transportFees.length,
    paidFees: transportFees.filter(f => f.status === 'Paid').length,
    pendingFees: transportFees.filter(f => f.status === 'Pending').length,
    totalAmount: transportFees.reduce((sum, f) => sum + (f.amount || 0), 0),
    paidAmount: transportFees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + (f.amount || 0), 0),
    pendingAmount: transportFees.filter(f => f.status === 'Pending').reduce((sum, f) => sum + (f.amount || 0), 0)
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Transport Fees</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/transport">Transport</Link></li>
              <li className="breadcrumb-item active">Transport Fees</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row mb-4">
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Total Allocations</h6>
                  <h4 className="mb-0">{stats.totalAllocations}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Total Fees</h6>
                  <h4 className="mb-0">{stats.totalFees}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Paid</h6>
                  <h4 className="mb-0 text-success">{stats.paidFees}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Pending</h6>
                  <h4 className="mb-0 text-warning">{stats.pendingFees}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Assign Transport Fee</h5>
                  <div className="row">
                    <div className="col-md-3">
                      <label className="form-label">Select Route</label>
                      <select
                        className="form-select"
                        value={selectedRoute}
                        onChange={(e) => setSelectedRoute(e.target.value)}
                      >
                        <option value="">All Routes</option>
                        {routes.filter(r => r.status === 'Active').map(route => (
                          <option key={route.id} value={route.id}>
                            {route.routeName} ({route.routeNumber})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Filter by Class</label>
                      <select
                        className="form-select"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                      >
                        <option value="">All Classes</option>
                        {[...new Set(activeAllocations.map(a => a.class))].map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Fee Type</label>
                      <select
                        className="form-select"
                        value={feeType}
                        onChange={(e) => setFeeType(e.target.value)}
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Amount (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={feeAmount}
                        onChange={(e) => setFeeAmount(e.target.value)}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Due Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-1">
                      <label className="form-label">&nbsp;</label>
                      <button
                        className="btn btn-primary w-100"
                        onClick={handleAssignFee}
                        disabled={!feeAmount || !dueDate}
                      >
                        <i className="bi bi-check-circle"></i> Assign
                      </button>
                    </div>
                  </div>
                  {filteredAllocations.length > 0 && (
                    <div className="alert alert-info mt-3">
                      <strong>{filteredAllocations.length}</strong> student(s) will be assigned the transport fee
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title">Transport Fee Records</h5>
                    <div>
                      <input
                        type="text"
                        className="form-control d-inline-block me-2"
                        style={{ width: '250px' }}
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <select
                        className="form-select d-inline-block"
                        style={{ width: '150px' }}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="All">All Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Admission No</th>
                          <th>Student Name</th>
                          <th>Class</th>
                          <th>Route</th>
                          <th>Amount</th>
                          <th>Due Date</th>
                          <th>Paid Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFees.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="text-center text-muted">
                              No transport fees found
                            </td>
                          </tr>
                        ) : (
                          filteredFees.map((fee) => (
                            <tr key={fee.id}>
                              <td><strong>{fee.admissionNo || '-'}</strong></td>
                              <td>{fee.studentName}</td>
                              <td>{fee.class}</td>
                              <td>{fee.routeName || '-'}</td>
                              <td>₹{fee.amount?.toLocaleString() || '0'}</td>
                              <td>{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : '-'}</td>
                              <td>{fee.paidDate ? new Date(fee.paidDate).toLocaleDateString() : '-'}</td>
                              <td>
                                <span className={`badge ${fee.status === 'Paid' ? 'bg-success' : 'bg-warning'}`}>
                                  {fee.status}
                                </span>
                              </td>
                              <td>
                                <Link
                                  to={`/fees/receipts/${fee.id}`}
                                  className="btn btn-sm btn-info"
                                  title="View Receipt"
                                >
                                  <i className="bi bi-receipt"></i>
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

export default TransportFees;

