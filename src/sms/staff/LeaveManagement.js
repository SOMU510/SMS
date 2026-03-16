import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const LeaveManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { leaveRequests, staff, teachers, addLeaveRequest, updateLeaveRequest, deleteLeaveRequest } = useSchool();
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    staffId: '',
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    days: 0,
    reason: '',
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'Pending',
    approvedBy: '',
    remarks: ''
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');

  // Combine staff and teachers
  const allStaff = [...staff, ...teachers.map(t => ({ ...t, staffType: 'Teacher' }))];

  // Load leave request data if editing
  useEffect(() => {
    if (isEditMode) {
      const leave = leaveRequests.find(l => l.id === parseInt(id));
      if (leave) {
        setFormData({
          staffId: leave.staffId || '',
          leaveType: leave.leaveType || 'Casual Leave',
          startDate: leave.startDate || '',
          endDate: leave.endDate || '',
          days: leave.days || 0,
          reason: leave.reason || '',
          appliedDate: leave.appliedDate || '',
          status: leave.status || 'Pending',
          approvedBy: leave.approvedBy || '',
          remarks: leave.remarks || ''
        });
      }
    }
  }, [id, isEditMode, leaveRequests]);

  // Calculate days when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setFormData(prev => ({ ...prev, days: diffDays }));
      }
    }
  }, [formData.startDate, formData.endDate]);

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
    
    if (!formData.staffId) {
      newErrors.staffId = 'Staff member is required';
    }
    
    if (!formData.leaveType) {
      newErrors.leaveType = 'Leave type is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end < start) {
        newErrors.endDate = 'End date must be after or equal to start date';
      }
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const selectedStaff = allStaff.find(s => s.id === parseInt(formData.staffId));
      const leaveData = {
        ...formData,
        staffName: selectedStaff ? `${selectedStaff.firstName} ${selectedStaff.lastName}` : '',
        employeeId: selectedStaff?.employeeId || ''
      };

      if (isEditMode) {
        updateLeaveRequest(parseInt(id), leaveData);
        alert('Leave request updated successfully!');
      } else {
        addLeaveRequest(leaveData);
        alert('Leave request submitted successfully!');
      }
      navigate('/staff/leave');
    }
  };

  const handleDelete = (leaveId, staffName) => {
    if (window.confirm(`Are you sure you want to delete leave request for ${staffName}?`)) {
      deleteLeaveRequest(leaveId);
    }
  };

  const handleStatusChange = (leaveId, newStatus) => {
    const leave = leaveRequests.find(l => l.id === leaveId);
    if (leave) {
      updateLeaveRequest(leaveId, {
        ...leave,
        status: newStatus,
        approvedBy: newStatus === 'Approved' ? 'Admin' : leave.approvedBy
      });
    }
  };

  // Filter leave requests
  let filteredLeaves = leaveRequests.filter(leave =>
    leave.staffName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.leaveType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterStatus !== 'All') {
    filteredLeaves = filteredLeaves.filter(leave => leave.status === filterStatus);
  }

  if (filterType !== 'All') {
    filteredLeaves = filteredLeaves.filter(leave => leave.leaveType === filterType);
  }

  const getStatusBadge = (status) => {
    const badges = {
      'Pending': 'bg-warning',
      'Approved': 'bg-success',
      'Rejected': 'bg-danger',
      'Cancelled': 'bg-secondary'
    };
    return badges[status] || 'bg-secondary';
  };

  // If not in add/edit mode, show list view, otherwise show form
  if (!showForm) {
    // Get statistics
    const stats = {
      total: leaveRequests.length,
      pending: leaveRequests.filter(l => l.status === 'Pending').length,
      approved: leaveRequests.filter(l => l.status === 'Approved').length,
      rejected: leaveRequests.filter(l => l.status === 'Rejected').length
    };

    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Leave Management</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">Leave Management</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            {/* Statistics Cards */}
            <div className="row mb-4">
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body text-center">
                    <h6 className="text-muted mb-1">Total Requests</h6>
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
                    <h6 className="text-muted mb-1">Approved</h6>
                    <h4 className="mb-0 text-success">{stats.approved}</h4>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body text-center">
                    <h6 className="text-muted mb-1">Rejected</h6>
                    <h4 className="mb-0 text-danger">{stats.rejected}</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Leave Requests</h5>
                      <Link to="/staff/leave/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Request Leave
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by name, employee ID, leave type..."
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
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-select"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                        >
                          <option value="All">All Leave Types</option>
                          <option value="Casual Leave">Casual Leave</option>
                          <option value="Sick Leave">Sick Leave</option>
                          <option value="Earned Leave">Earned Leave</option>
                          <option value="Emergency Leave">Emergency Leave</option>
                          <option value="Maternity Leave">Maternity Leave</option>
                          <option value="Paternity Leave">Paternity Leave</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Employee ID</th>
                            <th>Staff Name</th>
                            <th>Leave Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Days</th>
                            <th>Applied Date</th>
                            <th>Status</th>
                            <th>Approved By</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLeaves.length === 0 ? (
                            <tr>
                              <td colSpan="10" className="text-center">
                                <p className="text-muted">No leave requests found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredLeaves.map((leave) => (
                              <tr key={leave.id}>
                                <td>{leave.employeeId || '-'}</td>
                                <td>
                                  <strong>{leave.staffName || '-'}</strong>
                                </td>
                                <td>{leave.leaveType || '-'}</td>
                                <td>{leave.startDate ? new Date(leave.startDate).toLocaleDateString() : '-'}</td>
                                <td>{leave.endDate ? new Date(leave.endDate).toLocaleDateString() : '-'}</td>
                                <td>
                                  <span className="badge bg-info">{leave.days || 0} days</span>
                                </td>
                                <td>{leave.appliedDate ? new Date(leave.appliedDate).toLocaleDateString() : '-'}</td>
                                <td>
                                  <span className={`badge ${getStatusBadge(leave.status)}`}>
                                    {leave.status}
                                  </span>
                                </td>
                                <td>{leave.approvedBy || '-'}</td>
                                <td>
                                  {leave.status === 'Pending' && (
                                    <>
                                      <button
                                        className="btn btn-sm btn-success me-1"
                                        onClick={() => handleStatusChange(leave.id, 'Approved')}
                                        title="Approve"
                                      >
                                        <i className="bi bi-check-circle"></i>
                                      </button>
                                      <button
                                        className="btn btn-sm btn-danger me-1"
                                        onClick={() => handleStatusChange(leave.id, 'Rejected')}
                                        title="Reject"
                                      >
                                        <i className="bi bi-x-circle"></i>
                                      </button>
                                    </>
                                  )}
                                  <Link
                                    to={`/staff/leave/${leave.id}`}
                                    className="btn btn-sm btn-primary me-1"
                                    title="View/Edit"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(leave.id, leave.staffName)}
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
          <h1>{isEditMode ? 'Edit Leave Request' : 'Request Leave'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/staff/leave">Leave Management</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Request'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Leave Request Information</h5>
                  <form onSubmit={handleSubmit}>
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
                      <div className="col-md-6">
                        <label className="form-label">
                          Leave Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.leaveType ? 'is-invalid' : ''}`}
                          name="leaveType"
                          value={formData.leaveType}
                          onChange={handleChange}
                        >
                          <option value="Casual Leave">Casual Leave</option>
                          <option value="Sick Leave">Sick Leave</option>
                          <option value="Earned Leave">Earned Leave</option>
                          <option value="Emergency Leave">Emergency Leave</option>
                          <option value="Maternity Leave">Maternity Leave</option>
                          <option value="Paternity Leave">Paternity Leave</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.leaveType && <div className="invalid-feedback">{errors.leaveType}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Start Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                        />
                        {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          End Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                        />
                        {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Total Days</label>
                        <input
                          type="number"
                          className="form-control"
                          name="days"
                          value={formData.days}
                          readOnly
                          style={{ backgroundColor: '#f8f9fa' }}
                        />
                        <small className="form-text text-muted">Automatically calculated</small>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Applied Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="appliedDate"
                          value={formData.appliedDate}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">
                          Reason <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
                          name="reason"
                          value={formData.reason}
                          onChange={handleChange}
                          rows="4"
                          placeholder="Please provide a detailed reason for the leave request"
                        />
                        {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Approved By</label>
                        <input
                          type="text"
                          className="form-control"
                          name="approvedBy"
                          value={formData.approvedBy}
                          onChange={handleChange}
                          placeholder="Name of approver"
                        />
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
                        onClick={() => navigate('/staff/leave')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Submit'} Leave Request
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

export default LeaveManagement;

