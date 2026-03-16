import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const StudentAllocation = () => {
  const { 
    students,
    routes,
    vehicles,
    drivers,
    studentTransportAllocations,
    addStudentTransportAllocation,
    updateStudentTransportAllocation,
    deleteStudentTransportAllocation
  } = useSchool();

  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Filter students
  let filteredStudents = students;
  if (selectedClass) {
    filteredStudents = filteredStudents.filter(s => s.class === selectedClass);
  }
  if (searchTerm) {
    filteredStudents = filteredStudents.filter(s =>
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Get allocations for selected route
  const routeAllocations = selectedRoute
    ? studentTransportAllocations.filter(a => a.routeId === parseInt(selectedRoute))
    : [];

  const handleAllocate = (studentId) => {
    if (!selectedRoute) {
      alert('Please select a route first');
      return;
    }

    const existing = studentTransportAllocations.find(
      a => a.studentId === studentId && a.routeId === parseInt(selectedRoute)
    );

    if (existing) {
      if (window.confirm('Student is already allocated to this route. Update allocation?')) {
        const allocationData = {
          ...existing,
          status: 'Active',
          allocationDate: new Date().toISOString().split('T')[0]
        };
        updateStudentTransportAllocation(existing.id, allocationData);
        alert('Allocation updated successfully!');
      }
    } else {
      const student = students.find(s => s.id === studentId);
      const route = routes.find(r => r.id === parseInt(selectedRoute));
      const vehicle = vehicles.find(v => v.id === route?.vehicleId);
      const driver = drivers.find(d => d.id === route?.driverId);

      const allocationData = {
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        admissionNo: student.admissionNo,
        class: student.class,
        section: student.section,
        routeId: parseInt(selectedRoute),
        routeName: route?.routeName || '',
        vehicleId: route?.vehicleId || null,
        vehicleNumber: vehicle?.vehicleNumber || '',
        driverId: route?.driverId || null,
        driverName: driver ? `${driver.firstName} ${driver.lastName}` : '',
        pickupPointId: null,
        dropPointId: null,
        allocationDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        notes: ''
      };

      addStudentTransportAllocation(allocationData);
      alert('Student allocated to route successfully!');
    }
  };

  const handleDeallocate = (allocationId, studentName) => {
    if (window.confirm(`Are you sure you want to deallocate ${studentName}?`)) {
      const allocation = studentTransportAllocations.find(a => a.id === allocationId);
      if (allocation) {
        updateStudentTransportAllocation(allocationId, { ...allocation, status: 'Inactive' });
        alert('Student deallocated successfully!');
      }
    }
  };

  const handleDelete = (allocationId, studentName) => {
    if (window.confirm(`Are you sure you want to delete allocation for ${studentName}?`)) {
      deleteStudentTransportAllocation(allocationId);
    }
  };

  // Filter allocations
  let filteredAllocations = studentTransportAllocations;
  if (selectedRoute) {
    filteredAllocations = filteredAllocations.filter(a => a.routeId === parseInt(selectedRoute));
  }
  if (filterStatus !== 'All') {
    filteredAllocations = filteredAllocations.filter(a => a.status === filterStatus);
  }

  const selectedRouteObj = routes.find(r => r.id === parseInt(selectedRoute));
  const routeVehicle = selectedRouteObj ? vehicles.find(v => v.id === selectedRouteObj.vehicleId) : null;
  const routeDriver = selectedRouteObj ? drivers.find(d => d.id === selectedRouteObj.driverId) : null;

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Student Transport Allocation</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/transport">Transport</Link></li>
              <li className="breadcrumb-item active">Student Allocation</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row mb-3">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Select Route and Allocate Students</h5>
                  <div className="row">
                    <div className="col-md-4">
                      <label className="form-label">
                        Select Route <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={selectedRoute}
                        onChange={(e) => setSelectedRoute(e.target.value)}
                      >
                        <option value="">Select Route</option>
                        {routes.filter(r => r.status === 'Active').map(route => (
                          <option key={route.id} value={route.id}>
                            {route.routeName} ({route.routeNumber}) - {route.startPoint} to {route.endPoint}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Filter by Class</label>
                      <select
                        className="form-select"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                      >
                        <option value="">All Classes</option>
                        {[...new Set(students.map(s => s.class))].map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Search Students</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name or admission no..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {selectedRouteObj && (
                    <div className="alert alert-info mt-3">
                      <strong>Selected Route:</strong> {selectedRouteObj.routeName} ({selectedRouteObj.routeNumber})<br />
                      <strong>Vehicle:</strong> {routeVehicle ? routeVehicle.vehicleNumber : 'Not Assigned'}<br />
                      <strong>Driver:</strong> {routeDriver ? `${routeDriver.firstName} ${routeDriver.lastName}` : 'Not Assigned'}<br />
                      <strong>Distance:</strong> {selectedRouteObj.distance} km
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {selectedRoute && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Available Students</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Admission No</th>
                            <th>Student Name</th>
                            <th>Class</th>
                            <th>Section</th>
                            <th>Current Allocation</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="text-center text-muted">
                                No students found
                              </td>
                            </tr>
                          ) : (
                            filteredStudents.map((student) => {
                              const existingAllocation = studentTransportAllocations.find(
                                a => a.studentId === student.id && a.status === 'Active'
                              );
                              return (
                                <tr key={student.id}>
                                  <td><strong>{student.admissionNo}</strong></td>
                                  <td>{student.firstName} {student.lastName}</td>
                                  <td>{student.class}</td>
                                  <td>{student.section}</td>
                                  <td>
                                    {existingAllocation ? (
                                      <span className="badge bg-info">
                                        {existingAllocation.routeName}
                                      </span>
                                    ) : (
                                      <span className="text-muted">Not Allocated</span>
                                    )}
                                  </td>
                                  <td>
                                    {existingAllocation && existingAllocation.routeId === parseInt(selectedRoute) ? (
                                      <span className="badge bg-success">Already Allocated</span>
                                    ) : (
                                      <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleAllocate(student.id)}
                                      >
                                        <i className="bi bi-plus-circle"></i> Allocate
                                      </button>
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
          )}

          <div className="row mt-3">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title">Current Allocations</h5>
                    <div>
                      <select
                        className="form-select d-inline-block"
                        style={{ width: '150px' }}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
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
                          <th>Vehicle</th>
                          <th>Driver</th>
                          <th>Allocation Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAllocations.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="text-center text-muted">
                              No allocations found
                            </td>
                          </tr>
                        ) : (
                          filteredAllocations.map((allocation) => (
                            <tr key={allocation.id}>
                              <td><strong>{allocation.admissionNo}</strong></td>
                              <td>{allocation.studentName}</td>
                              <td>{allocation.class}</td>
                              <td>{allocation.routeName}</td>
                              <td>{allocation.vehicleNumber || '-'}</td>
                              <td>{allocation.driverName || '-'}</td>
                              <td>{allocation.allocationDate ? new Date(allocation.allocationDate).toLocaleDateString() : '-'}</td>
                              <td>
                                <span className={`badge ${allocation.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                  {allocation.status}
                                </span>
                              </td>
                              <td>
                                {allocation.status === 'Active' ? (
                                  <button
                                    className="btn btn-sm btn-warning me-1"
                                    onClick={() => handleDeallocate(allocation.id, allocation.studentName)}
                                  >
                                    <i className="bi bi-x-circle"></i> Deallocate
                                  </button>
                                ) : null}
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(allocation.id, allocation.studentName)}
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
};

export default StudentAllocation;

