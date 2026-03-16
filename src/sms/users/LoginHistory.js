import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const LoginHistory = () => {
  const { 
    loginHistory,
    users
  } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser, setFilterUser] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter login history
  let filteredHistory = loginHistory.filter(login =>
    login.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    login.ipAddress?.includes(searchTerm) ||
    login.userAgent?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterUser !== 'All') {
    filteredHistory = filteredHistory.filter(l => l.userId === parseInt(filterUser));
  }

  if (filterStatus !== 'All') {
    filteredHistory = filteredHistory.filter(l => l.status === filterStatus);
  }

  if (startDate) {
    filteredHistory = filteredHistory.filter(l => l.loginTime && l.loginTime >= startDate);
  }

  if (endDate) {
    filteredHistory = filteredHistory.filter(l => l.loginTime && l.loginTime <= endDate);
  }

  // Statistics
  const stats = {
    total: loginHistory.length,
    successful: loginHistory.filter(l => l.status === 'Success').length,
    failed: loginHistory.filter(l => l.status === 'Failed').length,
    uniqueUsers: new Set(loginHistory.map(l => l.userId)).size
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Login History</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/users">User Management</Link></li>
              <li className="breadcrumb-item active">Login History</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row mb-4">
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Total Logins</h6>
                  <h4 className="mb-0">{stats.total}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Successful</h6>
                  <h4 className="mb-0 text-success">{stats.successful}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Failed</h6>
                  <h4 className="mb-0 text-danger">{stats.failed}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Unique Users</h6>
                  <h4 className="mb-0 text-primary">{stats.uniqueUsers}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Login History</h5>
                  <div className="row mb-3">
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by username, IP..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2">
                      <select
                        className="form-select"
                        value={filterUser}
                        onChange={(e) => setFilterUser(e.target.value)}
                      >
                        <option value="All">All Users</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.username}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <select
                        className="form-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="All">All Status</option>
                        <option value="Success">Success</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Start Date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="End Date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Date & Time</th>
                          <th>Username</th>
                          <th>User</th>
                          <th>IP Address</th>
                          <th>Location</th>
                          <th>Device/Browser</th>
                          <th>Status</th>
                          <th>Failure Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHistory.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center text-muted">
                              No login history found
                            </td>
                          </tr>
                        ) : (
                          filteredHistory
                            .sort((a, b) => new Date(b.loginTime) - new Date(a.loginTime))
                            .map((login) => {
                              const user = users.find(u => u.id === login.userId);
                              return (
                                <tr key={login.id}>
                                  <td>
                                    {login.loginTime ? new Date(login.loginTime).toLocaleString() : '-'}
                                  </td>
                                  <td><strong>{login.username}</strong></td>
                                  <td>
                                    {user ? `${user.firstName} ${user.lastName}` : '-'}
                                  </td>
                                  <td>{login.ipAddress || '-'}</td>
                                  <td>{login.location || '-'}</td>
                                  <td>
                                    <small>{login.userAgent || '-'}</small>
                                  </td>
                                  <td>
                                    <span className={`badge ${
                                      login.status === 'Success' ? 'bg-success' : 'bg-danger'
                                    }`}>
                                      {login.status}
                                    </span>
                                  </td>
                                  <td>
                                    {login.failureReason ? (
                                      <span className="text-danger">{login.failureReason}</span>
                                    ) : (
                                      '-'
                                    )}
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
        </section>
      </div>
    </main>
  );
};

export default LoginHistory;

