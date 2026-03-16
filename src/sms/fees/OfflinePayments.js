import React, { useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const OfflinePayments = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { 
    fees,
    students,
    updateFee,
    addFee
  } = useSchool();

  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;

  const [formData, setFormData] = useState({
    studentId: '',
    feeType: '',
    amount: '',
    dueDate: '',
    paidDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    chequeNumber: '',
    bankName: '',
    transactionReference: '',
    remarks: '',
    status: 'Paid'
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterMethod, setFilterMethod] = useState('All');

  // Load fee data if editing
  React.useEffect(() => {
    if (isEditMode) {
      const fee = fees.find(f => f.id === parseInt(id));
      if (fee) {
        setFormData({
          studentId: fee.studentId || '',
          feeType: fee.feeType || '',
          amount: fee.amount || '',
          dueDate: fee.dueDate || '',
          paidDate: fee.paidDate || new Date().toISOString().split('T')[0],
          paymentMethod: fee.paymentMethod || 'Cash',
          chequeNumber: fee.chequeNumber || '',
          bankName: fee.bankName || '',
          transactionReference: fee.transactionReference || '',
          remarks: fee.remarks || '',
          status: fee.status || 'Paid'
        });
      }
    }
  }, [id, isEditMode, fees]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.studentId) {
      newErrors.studentId = 'Student is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    
    if (!formData.paidDate) {
      newErrors.paidDate = 'Payment date is required';
    }
    
    if (formData.paymentMethod === 'Cheque' && !formData.chequeNumber) {
      newErrors.chequeNumber = 'Cheque number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const student = students.find(s => s.id === parseInt(formData.studentId));
      if (!student) {
        alert('Student not found');
        return;
      }

      const feeData = {
        ...formData,
        studentName: `${student.firstName} ${student.lastName}`,
        class: student.class,
        section: student.section,
        amount: parseFloat(formData.amount),
        status: 'Paid'
      };

      if (isEditMode) {
        updateFee(parseInt(id), feeData);
        alert('Payment updated successfully!');
      } else {
        // Check if fee already exists
        const existing = fees.find(
          f => f.studentId === parseInt(formData.studentId) &&
               f.feeType === formData.feeType &&
               f.dueDate === formData.dueDate
        );

        if (existing && existing.status === 'Paid') {
          alert('This fee has already been paid!');
          return;
        }

        if (existing) {
          updateFee(existing.id, feeData);
          alert('Payment recorded successfully!');
        } else {
          addFee(feeData);
          alert('Payment recorded successfully!');
        }
      }
      navigate('/fees/offline');
    }
  };

  // Filter offline payments
  let filteredPayments = fees.filter(fee => {
    const isOffline = fee.paymentMethod && 
      ['Cash', 'Cheque', 'Bank Transfer', 'DD'].includes(fee.paymentMethod);
    const matchesSearch = 
      fee.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.transactionReference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || fee.status === filterStatus;
    const matchesMethod = filterMethod === 'All' || fee.paymentMethod === filterMethod;
    return isOffline && matchesSearch && matchesStatus && matchesMethod;
  });

  // Get pending fees for quick payment
  const pendingFees = fees.filter(f => f.status === 'Pending');

  // If not in add/edit mode, show list view
  if (!showForm) {
    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Offline Payments</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/fees">Fees</Link></li>
                <li className="breadcrumb-item active">Offline Payments</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row mb-3">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">Offline Payment Records</h5>
                      <Link to="/fees/offline/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Record Payment
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by student, reference..."
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
                        </select>
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-select"
                          value={filterMethod}
                          onChange={(e) => setFilterMethod(e.target.value)}
                        >
                          <option value="All">All Methods</option>
                          <option value="Cash">Cash</option>
                          <option value="Cheque">Cheque</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="DD">Demand Draft</option>
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
                            <th>Payment Method</th>
                            <th>Paid Date</th>
                            <th>Reference</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPayments.length === 0 ? (
                            <tr>
                              <td colSpan="9" className="text-center text-muted">
                                No offline payment records found
                              </td>
                            </tr>
                          ) : (
                            filteredPayments.map((fee) => (
                              <tr key={fee.id}>
                                <td>{fee.studentName}</td>
                                <td>{fee.class}</td>
                                <td>{fee.feeType}</td>
                                <td>₹{fee.amount?.toLocaleString() || '0'}</td>
                                <td>{fee.paymentMethod}</td>
                                <td>{fee.paidDate ? new Date(fee.paidDate).toLocaleDateString() : '-'}</td>
                                <td>{fee.transactionReference || fee.chequeNumber || '-'}</td>
                                <td>
                                  <span className={`badge ${fee.status === 'Paid' ? 'bg-success' : 'bg-warning'}`}>
                                    {fee.status}
                                  </span>
                                </td>
                                <td>
                                  <Link
                                    to={`/fees/offline/${fee.id}`}
                                    className="btn btn-sm btn-primary me-1"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  <Link
                                    to={`/fees/receipts/${fee.id}`}
                                    className="btn btn-sm btn-info"
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
  }

  // Form view
  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>{isEditMode ? 'Edit Payment' : 'Record Offline Payment'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/fees/offline">Offline Payments</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Record'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Payment Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Student <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.studentId ? 'is-invalid' : ''}`}
                          name="studentId"
                          value={formData.studentId}
                          onChange={handleChange}
                        >
                          <option value="">Select Student</option>
                          {students.map(student => (
                            <option key={student.id} value={student.id}>
                              {student.admissionNo} - {student.firstName} {student.lastName} ({student.class})
                            </option>
                          ))}
                        </select>
                        {errors.studentId && <div className="invalid-feedback">{errors.studentId}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Fee Type</label>
                        <input
                          type="text"
                          className="form-control"
                          name="feeType"
                          value={formData.feeType}
                          onChange={handleChange}
                          placeholder="e.g., Tuition Fee"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Amount <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                          name="amount"
                          value={formData.amount}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                        />
                        {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Due Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="dueDate"
                          value={formData.dueDate}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Paid Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className={`form-control ${errors.paidDate ? 'is-invalid' : ''}`}
                          name="paidDate"
                          value={formData.paidDate}
                          onChange={handleChange}
                          max={new Date().toISOString().split('T')[0]}
                        />
                        {errors.paidDate && <div className="invalid-feedback">{errors.paidDate}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Payment Method <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleChange}
                        >
                          <option value="Cash">Cash</option>
                          <option value="Cheque">Cheque</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="DD">Demand Draft</option>
                        </select>
                      </div>
                      {formData.paymentMethod === 'Cheque' && (
                        <>
                          <div className="col-md-4">
                            <label className="form-label">
                              Cheque Number <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.chequeNumber ? 'is-invalid' : ''}`}
                              name="chequeNumber"
                              value={formData.chequeNumber}
                              onChange={handleChange}
                            />
                            {errors.chequeNumber && <div className="invalid-feedback">{errors.chequeNumber}</div>}
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Bank Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="bankName"
                              value={formData.bankName}
                              onChange={handleChange}
                            />
                          </div>
                        </>
                      )}
                      {formData.paymentMethod === 'Bank Transfer' && (
                        <div className="col-md-4">
                          <label className="form-label">Transaction Reference</label>
                          <input
                            type="text"
                            className="form-control"
                            name="transactionReference"
                            value={formData.transactionReference}
                            onChange={handleChange}
                          />
                        </div>
                      )}
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
                          placeholder="Additional notes"
                        />
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate('/fees/offline')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Record'} Payment
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

export default OfflinePayments;

