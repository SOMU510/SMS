import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const StaffAttendance = () => {
  const { staff, teachers, staffAttendance, setStaffAttendance } = useSchool();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceData, setAttendanceData] = useState({});

  // Combine staff and teachers for attendance
  const allStaff = [...staff, ...teachers.map(t => ({ ...t, staffType: 'Teacher' }))];

  // Load attendance for selected date
  useEffect(() => {
    const dateAttendance = staffAttendance.filter(att => att.date === selectedDate);
    const initialData = {};
    dateAttendance.forEach(att => {
      initialData[att.staffId] = {
        status: att.status,
        checkIn: att.checkIn || '',
        checkOut: att.checkOut || '',
        notes: att.notes || ''
      };
    });
    setAttendanceData(initialData);
  }, [selectedDate, staffAttendance]);

  // Filter staff
  let filteredStaff = allStaff.filter(member =>
    member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.designation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterType !== 'All') {
    filteredStaff = filteredStaff.filter(member => member.staffType === filterType);
  }

  const handleAttendanceChange = (staffId, field, value) => {
    setAttendanceData(prev => ({
      ...prev,
      [staffId]: {
        ...prev[staffId],
        [field]: value
      }
    }));
  };

  const handleSaveAttendance = () => {
    const attendanceRecords = filteredStaff.map(member => {
      const existing = attendanceData[member.id] || {};
      return {
        id: Date.now() + member.id,
        staffId: member.id,
        staffName: `${member.firstName} ${member.lastName}`,
        employeeId: member.employeeId,
        date: selectedDate,
        status: existing.status || 'Present',
        checkIn: existing.checkIn || '',
        checkOut: existing.checkOut || '',
        notes: existing.notes || ''
      };
    });

    // Remove existing attendance for this date
    const updatedAttendance = staffAttendance.filter(att => att.date !== selectedDate);
    
    // Add new attendance records
    setStaffAttendance([...updatedAttendance, ...attendanceRecords]);
    alert('Attendance saved successfully!');
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Present': 'bg-success',
      'Absent': 'bg-danger',
      'Late': 'bg-warning',
      'Half Day': 'bg-info',
      'On Leave': 'bg-secondary'
    };
    return badges[status] || 'bg-secondary';
  };

  const getAttendanceStats = () => {
    const todayAttendance = staffAttendance.filter(att => att.date === selectedDate);
    const stats = {
      total: filteredStaff.length,
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      onLeave: 0
    };

    filteredStaff.forEach(member => {
      const att = todayAttendance.find(a => a.staffId === member.id);
      if (att) {
        const status = att.status.toLowerCase().replace(/\s/g, '');
        if (status === 'present') stats.present++;
        else if (status === 'absent') stats.absent++;
        else if (status === 'late') stats.late++;
        else if (status === 'halfday') stats.halfDay++;
        else if (status === 'onleave') stats.onLeave++;
      } else {
        // Check current form data
        const currentData = attendanceData[member.id];
        if (currentData && currentData.status) {
          const status = currentData.status.toLowerCase().replace(/\s/g, '');
          if (status === 'present') stats.present++;
          else if (status === 'absent') stats.absent++;
          else if (status === 'late') stats.late++;
          else if (status === 'halfday') stats.halfDay++;
          else if (status === 'onleave') stats.onLeave++;
        }
      }
    });

    return stats;
  };

  const stats = getAttendanceStats();

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Staff Attendance</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active">Staff Attendance</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-lg-2 col-md-4 col-sm-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Total Staff</h6>
                  <h4 className="mb-0">{stats.total}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Present</h6>
                  <h4 className="mb-0 text-success">{stats.present}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Absent</h6>
                  <h4 className="mb-0 text-danger">{stats.absent}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Late</h6>
                  <h4 className="mb-0 text-warning">{stats.late}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">Half Day</h6>
                  <h4 className="mb-0 text-info">{stats.halfDay}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 col-sm-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="text-muted mb-1">On Leave</h6>
                  <h4 className="mb-0 text-secondary">{stats.onLeave}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title">Mark Attendance</h5>
                    <div className="d-flex gap-2">
                      <input
                        type="date"
                        className="form-control"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{ width: 'auto' }}
                      />
                      <button
                        className="btn btn-success"
                        onClick={handleSaveAttendance}
                      >
                        <i className="bi bi-save"></i> Save Attendance
                      </button>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search staff by name, employee ID, designation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-select"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                      >
                        <option value="All">All Staff Types</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Principal">Principal</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Accountant">Accountant</option>
                        <option value="Librarian">Librarian</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Employee ID</th>
                          <th>Name</th>
                          <th>Designation</th>
                          <th>Department</th>
                          <th>Status</th>
                          <th>Check In</th>
                          <th>Check Out</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStaff.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              <p className="text-muted">No staff members found</p>
                            </td>
                          </tr>
                        ) : (
                          filteredStaff.map((member) => {
                            const currentData = attendanceData[member.id] || {};
                            const existingAttendance = staffAttendance.find(
                              att => att.staffId === member.id && att.date === selectedDate
                            );
                            const displayData = existingAttendance || currentData;

                            return (
                              <tr key={member.id}>
                                <td>
                                  <strong>{member.employeeId || '-'}</strong>
                                </td>
                                <td>
                                  <strong>
                                    {member.firstName} {member.lastName}
                                  </strong>
                                </td>
                                <td>{member.designation || '-'}</td>
                                <td>{member.department || '-'}</td>
                                <td>
                                  <select
                                    className={`form-select form-select-sm ${getStatusBadge(displayData.status || 'Present')}`}
                                    value={displayData.status || 'Present'}
                                    onChange={(e) => handleAttendanceChange(member.id, 'status', e.target.value)}
                                    style={{ minWidth: '120px' }}
                                  >
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                    <option value="Late">Late</option>
                                    <option value="Half Day">Half Day</option>
                                    <option value="On Leave">On Leave</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    type="time"
                                    className="form-control form-control-sm"
                                    value={displayData.checkIn || ''}
                                    onChange={(e) => handleAttendanceChange(member.id, 'checkIn', e.target.value)}
                                    disabled={displayData.status === 'Absent' || displayData.status === 'On Leave'}
                                    style={{ minWidth: '100px' }}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="time"
                                    className="form-control form-control-sm"
                                    value={displayData.checkOut || ''}
                                    onChange={(e) => handleAttendanceChange(member.id, 'checkOut', e.target.value)}
                                    disabled={displayData.status === 'Absent' || displayData.status === 'On Leave'}
                                    style={{ minWidth: '100px' }}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Notes"
                                    value={displayData.notes || ''}
                                    onChange={(e) => handleAttendanceChange(member.id, 'notes', e.target.value)}
                                    style={{ minWidth: '150px' }}
                                  />
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

          {/* Attendance History */}
          <div className="row mt-4">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Recent Attendance Records</h5>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Employee ID</th>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Check In</th>
                          <th>Check Out</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffAttendance.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center">
                              <p className="text-muted">No attendance records found</p>
                            </td>
                          </tr>
                        ) : (
                          staffAttendance
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .slice(0, 10)
                            .map((attendance) => (
                              <tr key={attendance.id}>
                                <td>{new Date(attendance.date).toLocaleDateString()}</td>
                                <td>{attendance.employeeId || '-'}</td>
                                <td>{attendance.staffName || '-'}</td>
                                <td>
                                  <span className={`badge ${getStatusBadge(attendance.status)}`}>
                                    {attendance.status}
                                  </span>
                                </td>
                                <td>{attendance.checkIn || '-'}</td>
                                <td>{attendance.checkOut || '-'}</td>
                                <td>{attendance.notes || '-'}</td>
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

export default StaffAttendance;

