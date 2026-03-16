import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const OnlinePayments = () => {
  const { 
    fees,
    students,
    updateFee
  } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('All');

  // Filter online payments
  let filteredPayments = fees.filter(fee => {
    const matchesSearch = 
      fee.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || fee.status === filterStatus;
    const matchesMethod = filterPaymentMethod === 'All' || 
      (filterPaymentMethod === 'Online' && (fee.paymentMethod === 'Online' || fee.paymentMethod === 'UPI' || fee.paymentMethod === 'Card'));
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Filter only pending fees for payment
  const pendingFees = fees.filter(f => f.status === 'Pending');

  const handleProcessPayment = (feeId) => {
    const fee = fees.find(f => f.id === feeId);
    if (!fee) return;

    const transactionId = `TXN${Date.now()}`;
    const updatedFee = {
      ...fee,
      status: 'Paid',
      paidDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Online',
      transactionId: transactionId,
      paymentGateway: 'Razorpay', // or other gateway
      paymentTime: new Date().toISOString()
    };

    if (window.confirm(`Process payment of ₹${fee.amount.toLocaleString()} for ${fee.studentName}?`)) {
      updateFee(feeId, updatedFee);
      alert(`Payment processed successfully! Transaction ID: ${transactionId}`);
    }
  };

  // Statistics
  const stats = {
    total: filteredPayments.length,
    paid: filteredPayments.filter(f => f.status === 'Paid').length,
    pending: filteredPayments.filter(f => f.status === 'Pending').length,
    totalAmount: filteredPayments.reduce((sum, f) => sum + (f.amount || 0), 0),
    paidAmount: filteredPayments.filter(f => f.status === 'Paid').reduce((sum, f) => sum + (f.amount || 0), 0),
    pendingAmount: filteredPayments.filter(f => f.status === 'Pending').reduce((sum, f) => sum + (f.amount || 0), 0)
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Online Payments</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/fees">Fees</Link></li>
              <li className="breadcrumb-item active">Online Payments</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row mb-4">
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Total Payments</h6>
                  <h4 className="mb-0">{stats.total}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Paid</h6>
                  <h4 className="mb-0 text-success">{stats.paid}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Pending</h6>
                  <h4 className="mb-0 text-warning">{stats.pending}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Total Amount</h6>
                  <h4 className="mb-0 text-primary">₹{stats.totalAmount.toLocaleString()}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Online Payment Records</h5>
                  
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by student, transaction ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="All">All Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-select"
                        value={filterPaymentMethod}
                        onChange={(e) => setFilterPaymentMethod(e.target.value)}
                      >
                        <option value="All">All Methods</option>
                        <option value="Online">Online</option>
                        <option value="UPI">UPI</option>
                        <option value="Card">Card</option>
                      </select>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Student Name</th>
                          <th>Class</th>
                          <th>Fee Type</th>
                          <th>Amount</th>
                          <th>Due Date</th>
                          <th>Transaction ID</th>
                          <th>Payment Gateway</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayments.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="text-center text-muted">
                              No payment records found
                            </td>
                          </tr>
                        ) : (
                          filteredPayments.map((fee) => (
                            <tr key={fee.id}>
                              <td>{fee.studentName}</td>
                              <td>{fee.class}</td>
                              <td>{fee.feeType}</td>
                              <td>₹{fee.amount?.toLocaleString() || '0'}</td>
                              <td>{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : '-'}</td>
                              <td>{fee.transactionId || '-'}</td>
                              <td>{fee.paymentGateway || '-'}</td>
                              <td>
                                <span className={`badge ${
                                  fee.status === 'Paid' ? 'bg-success' : 
                                  fee.status === 'Failed' ? 'bg-danger' : 
                                  'bg-warning'
                                }`}>
                                  {fee.status}
                                </span>
                              </td>
                              <td>
                                {fee.status === 'Pending' && (
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleProcessPayment(fee.id)}
                                  >
                                    <i className="bi bi-check-circle"></i> Process
                                  </button>
                                )}
                                {fee.status === 'Paid' && fee.transactionId && (
                                  <Link
                                    to={`/fees/receipts/${fee.id}`}
                                    className="btn btn-sm btn-info"
                                  >
                                    <i className="bi bi-receipt"></i> Receipt
                                  </Link>
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

export default OnlinePayments;

