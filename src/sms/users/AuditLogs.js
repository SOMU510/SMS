import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const AuditLogs = () => {
  const { 
    auditLogs,
    users
  } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser, setFilterUser] = useState('All');
  const [filterAction, setFilterAction] = useState('All');
  const [filterModule, setFilterModule] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter audit logs
  let filteredLogs = auditLogs.filter(log =>
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.module?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ipAddress?.includes(searchTerm)
  );

  if (filterUser !== 'All') {
    filteredLogs = filteredLogs.filter(l => l.userId === parseInt(filterUser));
  }

  if (filterAction !== 'All') {
    filteredLogs = filteredLogs.filter(l => l.action === filterAction);
  }

  if (filterModule !== 'All') {
    filteredLogs = filteredLogs.filter(l => l.module === filterModule);
  }

  if (startDate) {
    filteredLogs = filteredLogs.filter(l => l.timestamp && l.timestamp >= startDate);
  }

  if (endDate) {
    filteredLogs = filteredLogs.filter(l => l.timestamp && l.timestamp <= endDate);
  }

  // Get unique actions and modules for filters
  const uniqueActions = [...new Set(auditLogs.map(l => l.action))].filter(Boolean);
  const uniqueModules = [...new Set(auditLogs.map(l => l.module))].filter(Boolean);

  // Statistics
  const stats = {
    total: auditLogs.length,
    today: auditLogs.filter(l => {
      const today = new Date().toISOString().split('T')[0];
      return l.timestamp && l.timestamp.startsWith(today);
    }).length,
    thisWeek: auditLogs.filter(l => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return l.timestamp && new Date(l.timestamp) >= weekAgo;
    }).length,
    uniqueUsers: new Set(auditLogs.map(l => l.userId)).size
  };

  const getActionBadge = (action) => {
    switch(action) {
      case 'Create':
      case 'Add':
        return 'bg-success';
      case 'Update':
      case 'Edit':
        return 'bg-info';
      case 'Delete':
      case 'Remove':
        return 'bg-danger';
      case 'View':
      case 'Read':
        return 'bg-secondary';
      default:
        return 'bg-primary';
    }
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Audit Logs</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/users">User Management</Link></li>
              <li className="breadcrumb-item active">Audit Logs</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row mb-4">
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Total Logs</h6>
                  <h4 className="mb-0">{stats.total}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Today</h6>
                  <h4 className="mb-0 text-primary">{stats.today}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">This Week</h6>
                  <h4 className="mb-0 text-info">{stats.thisWeek}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Active Users</h6>
                  <h4 className="mb-0 text-success">{stats.uniqueUsers}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Audit Logs</h5>
                  <div className="row mb-3">
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by action, module, description..."
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
                        value={filterAction}
                        onChange={(e) => setFilterAction(e.target.value)}
                      >
                        <option value="All">All Actions</option>
                        {uniqueActions.map(action => (
                          <option key={action} value={action}>{action}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <select
                        className="form-select"
                        value={filterModule}
                        onChange={(e) => setFilterModule(e.target.value)}
                      >
                        <option value="All">All Modules</option>
                        {uniqueModules.map(module => (
                          <option key={module} value={module}>{module}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-1">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Start"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2">
                      <input
                        type="date"
                        className="form-control"
                        placeholder="End"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>User</th>
                          <th>Action</th>
                          <th>Module</th>
                          <th>Description</th>
                          <th>IP Address</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLogs.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center text-muted">
                              No audit logs found
                            </td>
                          </tr>
                        ) : (
                          filteredLogs
                            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                            .map((log) => {
                              const user = users.find(u => u.id === log.userId);
                              return (
                                <tr key={log.id}>
                                  <td>
                                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}
                                  </td>
                                  <td>
                                    {user ? (
                                      <>
                                        <strong>{user.username}</strong><br />
                                        <small className="text-muted">{user.firstName} {user.lastName}</small>
                                      </>
                                    ) : (
                                      log.username || '-'
                                    )}
                                  </td>
                                  <td>
                                    <span className={`badge ${getActionBadge(log.action)}`}>
                                      {log.action}
                                    </span>
                                  </td>
                                  <td>{log.module || '-'}</td>
                                  <td>{log.description || '-'}</td>
                                  <td>{log.ipAddress || '-'}</td>
                                  <td>
                                    <span className={`badge ${
                                      log.status === 'Success' ? 'bg-success' :
                                      log.status === 'Failed' ? 'bg-danger' : 'bg-secondary'
                                    }`}>
                                      {log.status || 'Success'}
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
        </section>
      </div>
    </main>
  );
};

export default AuditLogs;

