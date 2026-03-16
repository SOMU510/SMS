import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const Payroll = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { payrolls, staff, teachers, addPayroll, updatePayroll, deletePayroll } = useSchool();
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    staffId: '',
    employeeId: '',
    staffName: '',
    month: new Date().toISOString().slice(0, 7), // YYYY-MM format
    year: new Date().getFullYear().toString(),
    basicSalary: 0,
    allowances: {
      houseRent: 0,
      medical: 0,
      transport: 0,
      other: 0
    },
    deductions: {
      tax: 0,
      providentFund: 0,
      insurance: 0,
      loan: 0,
      other: 0
    },
    overtime: 0,
    bonus: 0,
    grossSalary: 0,
    totalDeductions: 0,
    netSalary: 0,
    paymentDate: '',
    paymentMethod: 'Bank Transfer',
    status: 'Pending',
    remarks: ''
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterMonth, setFilterMonth] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Combine staff and teachers
  const allStaff = [...staff, ...teachers.map(t => ({ ...t, staffType: 'Teacher' }))];

  // Load payroll data if editing
  useEffect(() => {
    if (isEditMode) {
      const payroll = payrolls.find(p => p.id === parseInt(id));
      if (payroll) {
        setFormData({
          staffId: payroll.staffId || '',
          employeeId: payroll.employeeId || '',
          staffName: payroll.staffName || '',
          month: payroll.month || '',
          year: payroll.year || '',
          basicSalary: payroll.basicSalary || 0,
          allowances: payroll.allowances || {
            houseRent: 0,
            medical: 0,
            transport: 0,
            other: 0
          },
          deductions: payroll.deductions || {
            tax: 0,
            providentFund: 0,
            insurance: 0,
            loan: 0,
            other: 0
          },
          overtime: payroll.overtime || 0,
          bonus: payroll.bonus || 0,
          grossSalary: payroll.grossSalary || 0,
          totalDeductions: payroll.totalDeductions || 0,
          netSalary: payroll.netSalary || 0,
          paymentDate: payroll.paymentDate || '',
          paymentMethod: payroll.paymentMethod || 'Bank Transfer',
          status: payroll.status || 'Pending',
          remarks: payroll.remarks || ''
        });
      }
    }
  }, [id, isEditMode, payrolls]);

  // Load staff details when staff is selected
  useEffect(() => {
    if (formData.staffId) {
      const staffMember = allStaff.find(s => s.id === parseInt(formData.staffId));
      if (staffMember) {
        setSelectedStaff(staffMember);
        setFormData(prev => ({
          ...prev,
          employeeId: staffMember.employeeId || '',
          staffName: `${staffMember.firstName} ${staffMember.lastName}`,
          basicSalary: staffMember.salary ? parseFloat(staffMember.salary) : 0
        }));
      }
    }
  }, [formData.staffId, allStaff]);

  // Calculate salary when values change
  useEffect(() => {
    const allowances = formData.allowances.houseRent + 
                      formData.allowances.medical + 
                      formData.allowances.transport + 
                      formData.allowances.other;
    
    const deductions = formData.deductions.tax + 
                      formData.deductions.providentFund + 
                      formData.deductions.insurance + 
                      formData.deductions.loan + 
                      formData.deductions.other;
    
    const grossSalary = formData.basicSalary + allowances + formData.overtime + formData.bonus;
    const netSalary = grossSalary - deductions;

    setFormData(prev => ({
      ...prev,
      grossSalary: parseFloat(grossSalary.toFixed(2)),
      totalDeductions: parseFloat(deductions.toFixed(2)),
      netSalary: parseFloat(netSalary.toFixed(2))
    }));
  }, [
    formData.basicSalary,
    formData.allowances,
    formData.deductions,
    formData.overtime,
    formData.bonus
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('allowances.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        allowances: {
          ...prev.allowances,
          [field]: parseFloat(value) || 0
        }
      }));
    } else if (name.startsWith('deductions.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        deductions: {
          ...prev.deductions,
          [field]: parseFloat(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name.includes('Salary') || name === 'overtime' || name === 'bonus' 
          ? (parseFloat(value) || 0) 
          : value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.staffId) {
      newErrors.staffId = 'Staff member is required';
    }
    
    if (!formData.month) {
      newErrors.month = 'Month is required';
    }

    if (!formData.year) {
      newErrors.year = 'Year is required';
    }

    if (formData.basicSalary <= 0) {
      newErrors.basicSalary = 'Basic salary must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const payrollData = {
        ...formData,
        year: parseInt(formData.year)
      };

      if (isEditMode) {
        updatePayroll(parseInt(id), payrollData);
        alert('Payroll updated successfully!');
      } else {
        // Check if payroll already exists for this staff and month/year
        const existing = payrolls.find(
          p => p.staffId === parseInt(formData.staffId) && 
               p.month === formData.month && 
               p.year === formData.year
        );
        
        if (existing) {
          if (!window.confirm('Payroll already exists for this staff member and month. Do you want to update it?')) {
            return;
          }
          updatePayroll(existing.id, payrollData);
          alert('Payroll updated successfully!');
        } else {
          addPayroll(payrollData);
          alert('Payroll created successfully!');
        }
      }
      navigate('/staff/payroll');
    }
  };

  const handleDelete = (payrollId, staffName) => {
    if (window.confirm(`Are you sure you want to delete payroll for ${staffName}?`)) {
      deletePayroll(payrollId);
    }
  };

  const handleStatusChange = (payrollId, newStatus) => {
    const payroll = payrolls.find(p => p.id === payrollId);
    if (payroll) {
      updatePayroll(payrollId, {
        ...payroll,
        status: newStatus
      });
    }
  };

  // Filter payrolls
  let filteredPayrolls = payrolls.filter(payroll =>
    payroll.staffName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payroll.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterStatus !== 'All') {
    filteredPayrolls = filteredPayrolls.filter(p => p.status === filterStatus);
  }

  if (filterMonth) {
    filteredPayrolls = filteredPayrolls.filter(p => p.month === filterMonth);
  }

  const getStatusBadge = (status) => {
    const badges = {
      'Pending': 'bg-warning',
      'Paid': 'bg-success',
      'Processing': 'bg-info',
      'Cancelled': 'bg-secondary'
    };
    return badges[status] || 'bg-secondary';
  };

  // If not in add/edit mode, show list view, otherwise show form
  if (!showForm) {
    // Get statistics
    const stats = {
      total: payrolls.length,
      pending: payrolls.filter(p => p.status === 'Pending').length,
      paid: payrolls.filter(p => p.status === 'Paid').length,
      totalAmount: payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0)
    };

    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Payroll & Salary Management</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">Payroll & Salary</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            {/* Statistics Cards */}
            <div className="row mb-4">
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body text-center">
                    <h6 className="text-muted mb-1">Total Payrolls</h6>
                    <h4 className="mb-0">{stats.total}</h4>
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
                    <h6 className="text-muted mb-1">Paid</h6>
                    <h4 className="mb-0 text-success">{stats.paid}</h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body text-center">
                    <h6 className="text-muted mb-1">Total Amount</h6>
                    <h4 className="mb-0 text-primary">₹{stats.totalAmount.toLocaleString('en-IN')}</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Payrolls</h5>
                      <Link to="/staff/payroll/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Create Payroll
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by name, employee ID..."
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
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Paid">Paid</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <input
                          type="month"
                          className="form-control"
                          value={filterMonth}
                          onChange={(e) => setFilterMonth(e.target.value)}
                          placeholder="Filter by month"
                        />
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Employee ID</th>
                            <th>Staff Name</th>
                            <th>Month/Year</th>
                            <th>Basic Salary</th>
                            <th>Gross Salary</th>
                            <th>Deductions</th>
                            <th>Net Salary</th>
                            <th>Payment Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPayrolls.length === 0 ? (
                            <tr>
                              <td colSpan="10" className="text-center">
                                <p className="text-muted">No payroll records found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredPayrolls.map((payroll) => (
                              <tr key={payroll.id}>
                                <td>{payroll.employeeId || '-'}</td>
                                <td>
                                  <strong>{payroll.staffName || '-'}</strong>
                                </td>
                                <td>
                                  {payroll.month ? new Date(payroll.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '-'} / {payroll.year || '-'}
                                </td>
                                <td>₹{payroll.basicSalary?.toLocaleString('en-IN') || '0'}</td>
                                <td>₹{payroll.grossSalary?.toLocaleString('en-IN') || '0'}</td>
                                <td>₹{payroll.totalDeductions?.toLocaleString('en-IN') || '0'}</td>
                                <td>
                                  <strong className="text-success">₹{payroll.netSalary?.toLocaleString('en-IN') || '0'}</strong>
                                </td>
                                <td>{payroll.paymentDate ? new Date(payroll.paymentDate).toLocaleDateString() : '-'}</td>
                                <td>
                                  <span className={`badge ${getStatusBadge(payroll.status)}`}>
                                    {payroll.status}
                                  </span>
                                </td>
                                <td>
                                  {payroll.status === 'Pending' && (
                                    <button
                                      className="btn btn-sm btn-success me-1"
                                      onClick={() => handleStatusChange(payroll.id, 'Paid')}
                                      title="Mark as Paid"
                                    >
                                      <i className="bi bi-check-circle"></i>
                                    </button>
                                  )}
                                  <Link
                                    to={`/staff/payroll/${payroll.id}`}
                                    className="btn btn-sm btn-primary me-1"
                                    title="View/Edit"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(payroll.id, payroll.staffName)}
                                    title="Delete"
                                  >
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
  }

  // Form view (for both add and edit)
  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>{isEditMode ? 'Edit Payroll' : 'Create Payroll'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/staff/payroll">Payroll & Salary</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Create'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Payroll Information</h5>
                  <form onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Staff Member <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.staffId ? 'is-invalid' : ''}`}
                          name="staffId"
                          value={formData.staffId}
                          onChange={handleChange}
                          disabled={isEditMode}
                        >
                          <option value="">Select Staff Member</option>
                          {allStaff.map(member => (
                            <option key={member.id} value={member.id}>
                              {member.employeeId || 'N/A'} - {member.firstName} {member.lastName}
                            </option>
                          ))}
                        </select>
                        {errors.staffId && <div className="invalid-feedback">{errors.staffId}</div>}
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">
                          Month <span className="text-danger">*</span>
                        </label>
                        <input
                          type="month"
                          className={`form-control ${errors.month ? 'is-invalid' : ''}`}
                          name="month"
                          value={formData.month}
                          onChange={handleChange}
                        />
                        {errors.month && <div className="invalid-feedback">{errors.month}</div>}
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">
                          Year <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className={`form-control ${errors.year ? 'is-invalid' : ''}`}
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          min="2020"
                          max="2100"
                        />
                        {errors.year && <div className="invalid-feedback">{errors.year}</div>}
                      </div>
                    </div>

                    {/* Salary Details */}
                    <div className="card mb-3">
                      <div className="card-header">
                        <h6 className="mb-0">Salary Details</h6>
                      </div>
                      <div className="card-body">
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">
                              Basic Salary <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className={`form-control ${errors.basicSalary ? 'is-invalid' : ''}`}
                              name="basicSalary"
                              value={formData.basicSalary}
                              onChange={handleChange}
                              min="0"
                              step="0.01"
                            />
                            {errors.basicSalary && <div className="invalid-feedback">{errors.basicSalary}</div>}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Overtime</label>
                            <input
                              type="number"
                              className="form-control"
                              name="overtime"
                              value={formData.overtime}
                              onChange={handleChange}
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Bonus</label>
                            <input
                              type="number"
                              className="form-control"
                              name="bonus"
                              value={formData.bonus}
                              onChange={handleChange}
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Allowances */}
                    <div className="card mb-3">
                      <div className="card-header">
                        <h6 className="mb-0">Allowances</h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-3">
                            <label className="form-label">House Rent</label>
                            <input
                              type="number"
                              className="form-control"
                              name="allowances.houseRent"
                              value={formData.allowances.houseRent}
                              onChange={handleChange}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Medical</label>
                            <input
                              type="number"
                              className="form-control"
                              name="allowances.medical"
                              value={formData.allowances.medical}
                              onChange={handleChange}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Transport</label>
                            <input
                              type="number"
                              className="form-control"
                              name="allowances.transport"
                              value={formData.allowances.transport}
                              onChange={handleChange}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Other</label>
                            <input
                              type="number"
                              className="form-control"
                              name="allowances.other"
                              value={formData.allowances.other}
                              onChange={handleChange}
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div className="card mb-3">
                      <div className="card-header">
                        <h6 className="mb-0">Deductions</h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-3">
                            <label className="form-label">Tax</label>
                            <input
                              type="number"
                              className="form-control"
                              name="deductions.tax"
                              value={formData.deductions.tax}
                              onChange={handleChange}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Provident Fund</label>
                            <input
                              type="number"
                              className="form-control"
                              name="deductions.providentFund"
                              value={formData.deductions.providentFund}
                              onChange={handleChange}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Insurance</label>
                            <input
                              type="number"
                              className="form-control"
                              name="deductions.insurance"
                              value={formData.deductions.insurance}
                              onChange={handleChange}
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Loan</label>
                            <input
                              type="number"
                              className="form-control"
                              name="deductions.loan"
                              value={formData.deductions.loan}
                              onChange={handleChange}
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-md-3">
                            <label className="form-label">Other</label>
                            <input
                              type="number"
                              className="form-control"
                              name="deductions.other"
                              value={formData.deductions.other}
                              onChange={handleChange}
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Salary Summary */}
                    <div className="card mb-3 bg-light">
                      <div className="card-header">
                        <h6 className="mb-0">Salary Summary</h6>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-3">
                            <label className="form-label">Gross Salary</label>
                            <input
                              type="text"
                              className="form-control"
                              value={`₹${formData.grossSalary.toLocaleString('en-IN')}`}
                              readOnly
                              style={{ backgroundColor: '#fff', fontWeight: 'bold' }}
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Total Deductions</label>
                            <input
                              type="text"
                              className="form-control"
                              value={`₹${formData.totalDeductions.toLocaleString('en-IN')}`}
                              readOnly
                              style={{ backgroundColor: '#fff', fontWeight: 'bold' }}
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Net Salary</label>
                            <input
                              type="text"
                              className="form-control text-success"
                              value={`₹${formData.netSalary.toLocaleString('en-IN')}`}
                              readOnly
                              style={{ backgroundColor: '#fff', fontWeight: 'bold', fontSize: '1.2em' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Payment Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="paymentDate"
                          value={formData.paymentDate}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Payment Method</label>
                        <select
                          className="form-select"
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleChange}
                        >
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Cash">Cash</option>
                          <option value="Cheque">Cheque</option>
                          <option value="Online Payment">Online Payment</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Paid">Paid</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Remarks</label>
                        <textarea
                          className="form-control"
                          name="remarks"
                          value={formData.remarks}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Additional remarks or notes"
                        />
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate('/staff/payroll')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Create'} Payroll
                      </button>
                    </div>
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

export default Payroll;

