import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const Fees = () => {
  const { fees, deleteFee, students } = useSchool();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredFees = fees.filter(fee => {
    const matchesSearch = 
      fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.feeType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || fee.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id, studentName) => {
    if (window.confirm(`Are you sure you want to delete fee record for ${studentName}?`)) {
      deleteFee(id);
    }
  };

  const totalPaid = fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
  const totalPending = fees.filter(f => f.status === 'Pending').reduce((sum, f) => sum + f.amount, 0);

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Fee Management</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Fees</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-md-4">
              <div className="card info-card">
                <div className="card-body">
                  <h5 className="card-title">Total Paid</h5>
                  <h6 className="text-success">₹{totalPaid.toLocaleString()}</h6>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card info-card">
                <div className="card-body">
                  <h5 className="card-title">Total Pending</h5>
                  <h6 className="text-warning">₹{totalPending.toLocaleString()}</h6>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card info-card">
                <div className="card-body">
                  <h5 className="card-title">Total Amount</h5>
                  <h6 className="text-primary">₹{(totalPaid + totalPending).toLocaleString()}</h6>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title">Fee Records</h5>
                    <Link to="/fees/add" className="btn btn-primary">
                      <i className="bi bi-plus-circle"></i> Add Fee Record
                    </Link>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input type="text" className="form-control" placeholder="Search..."
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="">All Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
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
                          <th>Paid Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFees.length === 0 ? (
                          <tr><td colSpan="8" className="text-center"><p className="text-muted">No fee records found</p></td></tr>
                        ) : (
                          filteredFees.map((fee) => (
                            <tr key={fee.id}>
                              <td>{fee.studentName}</td>
                              <td>{fee.class}</td>
                              <td>{fee.feeType}</td>
                              <td>₹{fee.amount.toLocaleString()}</td>
                              <td>{fee.dueDate}</td>
                              <td>{fee.paidDate || '-'}</td>
                              <td>
                                <span className={`badge ${fee.status === 'Paid' ? 'bg-success' : 'bg-warning'}`}>
                                  {fee.status}
                                </span>
                              </td>
                              <td>
                                <button className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(fee.id, fee.studentName)}>
                                  <i className="bi bi-trash"></i>
                                </button>
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

export default Fees;

