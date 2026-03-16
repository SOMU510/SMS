import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const TransportReports = () => {
  const { 
    vehicles,
    drivers,
    routes,
    studentTransportAllocations,
    fees,
    students
  } = useSchool();

  const [reportType, setReportType] = useState('summary');
  const [selectedRoute, setSelectedRoute] = useState('All');
  const [selectedVehicle, setSelectedVehicle] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');

  // Summary Report
  const getSummaryReport = () => {
    const activeVehicles = vehicles.filter(v => v.status === 'Active').length;
    const activeDrivers = drivers.filter(d => d.status === 'Active').length;
    const activeRoutes = routes.filter(r => r.status === 'Active').length;
    const totalAllocations = studentTransportAllocations.filter(a => a.status === 'Active').length;
    const transportFees = fees.filter(f => f.feeType === 'Transport Fee' || f.feeType?.includes('Transport'));
    const totalFeeAmount = transportFees.reduce((sum, f) => sum + (f.amount || 0), 0);
    const paidFeeAmount = transportFees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + (f.amount || 0), 0);

    return {
      activeVehicles,
      activeDrivers,
      activeRoutes,
      totalAllocations,
      totalFeeAmount,
      paidFeeAmount,
      collectionRate: totalFeeAmount > 0 ? ((paidFeeAmount / totalFeeAmount) * 100).toFixed(1) : 0
    };
  };

  // Route-wise Report
  const getRouteReport = () => {
    const routeStats = {};
    
    routes.forEach(route => {
      const allocations = studentTransportAllocations.filter(
        a => a.routeId === route.id && a.status === 'Active'
      );
      const routeFees = fees.filter(
        f => f.routeId === route.id && (f.feeType === 'Transport Fee' || f.feeType?.includes('Transport'))
      );
      
      routeStats[route.id] = {
        routeName: route.routeName,
        routeNumber: route.routeNumber,
        allocations: allocations.length,
        totalFees: routeFees.length,
        paidFees: routeFees.filter(f => f.status === 'Paid').length,
        totalAmount: routeFees.reduce((sum, f) => sum + (f.amount || 0), 0),
        paidAmount: routeFees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + (f.amount || 0), 0)
      };
    });

    return Object.values(routeStats);
  };

  // Vehicle-wise Report
  const getVehicleReport = () => {
    const vehicleStats = {};
    
    vehicles.forEach(vehicle => {
      const route = routes.find(r => r.vehicleId === vehicle.id);
      if (route) {
        const allocations = studentTransportAllocations.filter(
          a => a.routeId === route.id && a.status === 'Active'
        );
        
        if (!vehicleStats[vehicle.id]) {
          vehicleStats[vehicle.id] = {
            vehicleNumber: vehicle.vehicleNumber,
            vehicleType: vehicle.vehicleType,
            capacity: vehicle.capacity,
            routes: [],
            totalAllocations: 0
          };
        }
        
        vehicleStats[vehicle.id].routes.push(route.routeName);
        vehicleStats[vehicle.id].totalAllocations += allocations.length;
      }
    });

    return Object.values(vehicleStats);
  };

  // Class-wise Report
  const getClassReport = () => {
    const classStats = {};
    
    studentTransportAllocations
      .filter(a => a.status === 'Active')
      .forEach(allocation => {
        if (!classStats[allocation.class]) {
          classStats[allocation.class] = {
            className: allocation.class,
            students: new Set(),
            routes: new Set()
          };
        }
        classStats[allocation.class].students.add(allocation.studentId);
        classStats[allocation.class].routes.add(allocation.routeId);
      });

    return Object.keys(classStats).map(className => ({
      className,
      studentCount: classStats[className].students.size,
      routeCount: classStats[className].routes.size
    }));
  };

  const summary = getSummaryReport();
  const routeReport = getRouteReport();
  const vehicleReport = getVehicleReport();
  const classReport = getClassReport();

  // Filter reports
  let filteredRouteReport = routeReport;
  if (selectedRoute !== 'All') {
    filteredRouteReport = routeReport.filter(r => r.routeId === parseInt(selectedRoute));
  }

  let filteredVehicleReport = vehicleReport;
  if (selectedVehicle !== 'All') {
    filteredVehicleReport = vehicleReport.filter(v => v.vehicleId === parseInt(selectedVehicle));
  }

  let filteredClassReport = classReport;
  if (selectedClass !== 'All') {
    filteredClassReport = classReport.filter(c => c.className === selectedClass);
  }

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Transport Reports</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/transport">Transport</Link></li>
              <li className="breadcrumb-item active">Reports</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row mb-3">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Select Report Type</h5>
                  <div className="row">
                    <div className="col-md-3">
                      <label className="form-label">Report Type</label>
                      <select
                        className="form-select"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                      >
                        <option value="summary">Summary</option>
                        <option value="route">Route-wise</option>
                        <option value="vehicle">Vehicle-wise</option>
                        <option value="class">Class-wise</option>
                      </select>
                    </div>
                    {reportType === 'route' && (
                      <div className="col-md-3">
                        <label className="form-label">Filter by Route</label>
                        <select
                          className="form-select"
                          value={selectedRoute}
                          onChange={(e) => setSelectedRoute(e.target.value)}
                        >
                          <option value="All">All Routes</option>
                          {routes.map(route => (
                            <option key={route.id} value={route.id}>{route.routeName}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {reportType === 'vehicle' && (
                      <div className="col-md-3">
                        <label className="form-label">Filter by Vehicle</label>
                        <select
                          className="form-select"
                          value={selectedVehicle}
                          onChange={(e) => setSelectedVehicle(e.target.value)}
                        >
                          <option value="All">All Vehicles</option>
                          {vehicles.map(vehicle => (
                            <option key={vehicle.id} value={vehicle.id}>{vehicle.vehicleNumber}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {reportType === 'class' && (
                      <div className="col-md-3">
                        <label className="form-label">Filter by Class</label>
                        <select
                          className="form-select"
                          value={selectedClass}
                          onChange={(e) => setSelectedClass(e.target.value)}
                        >
                          <option value="All">All Classes</option>
                          {[...new Set(students.map(s => s.class))].map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {reportType === 'summary' && (
            <>
              <div className="row mb-4">
                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h6 className="text-muted mb-1">Active Vehicles</h6>
                      <h4 className="mb-0">{summary.activeVehicles}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h6 className="text-muted mb-1">Active Drivers</h6>
                      <h4 className="mb-0">{summary.activeDrivers}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h6 className="text-muted mb-1">Active Routes</h6>
                      <h4 className="mb-0">{summary.activeRoutes}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h6 className="text-muted mb-1">Total Allocations</h6>
                      <h4 className="mb-0">{summary.totalAllocations}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Summary Report</h5>
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th>Metric</th>
                              <th>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><strong>Active Vehicles</strong></td>
                              <td>{summary.activeVehicles}</td>
                            </tr>
                            <tr>
                              <td><strong>Active Drivers</strong></td>
                              <td>{summary.activeDrivers}</td>
                            </tr>
                            <tr>
                              <td><strong>Active Routes</strong></td>
                              <td>{summary.activeRoutes}</td>
                            </tr>
                            <tr>
                              <td><strong>Total Student Allocations</strong></td>
                              <td>{summary.totalAllocations}</td>
                            </tr>
                            <tr>
                              <td><strong>Total Transport Fee Amount</strong></td>
                              <td>₹{summary.totalFeeAmount.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td><strong>Paid Transport Fee Amount</strong></td>
                              <td className="text-success">₹{summary.paidFeeAmount.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <td><strong>Collection Rate</strong></td>
                              <td>{summary.collectionRate}%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {reportType === 'route' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Route-wise Report</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Route Number</th>
                            <th>Route Name</th>
                            <th>Allocations</th>
                            <th>Total Fees</th>
                            <th>Paid Fees</th>
                            <th>Total Amount</th>
                            <th>Paid Amount</th>
                            <th>Collection %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRouteReport.length === 0 ? (
                            <tr>
                              <td colSpan="8" className="text-center text-muted">
                                No data available
                              </td>
                            </tr>
                          ) : (
                            filteredRouteReport.map((route, index) => {
                              const collectionRate = route.totalAmount > 0 
                                ? ((route.paidAmount / route.totalAmount) * 100).toFixed(1) 
                                : 0;
                              return (
                                <tr key={index}>
                                  <td><strong>{route.routeNumber}</strong></td>
                                  <td>{route.routeName}</td>
                                  <td>{route.allocations}</td>
                                  <td>{route.totalFees}</td>
                                  <td className="text-success">{route.paidFees}</td>
                                  <td>₹{route.totalAmount.toLocaleString()}</td>
                                  <td className="text-success">₹{route.paidAmount.toLocaleString()}</td>
                                  <td>
                                    <span className={`badge ${parseFloat(collectionRate) >= 75 ? 'bg-success' : parseFloat(collectionRate) >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                                      {collectionRate}%
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
          )}

          {reportType === 'vehicle' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Vehicle-wise Report</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Vehicle Number</th>
                            <th>Vehicle Type</th>
                            <th>Capacity</th>
                            <th>Routes</th>
                            <th>Total Allocations</th>
                            <th>Utilization %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredVehicleReport.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="text-center text-muted">
                                No data available
                              </td>
                            </tr>
                          ) : (
                            filteredVehicleReport.map((vehicle, index) => {
                              const utilization = vehicle.capacity > 0 
                                ? ((vehicle.totalAllocations / vehicle.capacity) * 100).toFixed(1) 
                                : 0;
                              return (
                                <tr key={index}>
                                  <td><strong>{vehicle.vehicleNumber}</strong></td>
                                  <td>{vehicle.vehicleType}</td>
                                  <td>{vehicle.capacity} seats</td>
                                  <td>{vehicle.routes.join(', ') || '-'}</td>
                                  <td>{vehicle.totalAllocations}</td>
                                  <td>
                                    <span className={`badge ${parseFloat(utilization) >= 80 ? 'bg-danger' : parseFloat(utilization) >= 60 ? 'bg-warning' : 'bg-success'}`}>
                                      {utilization}%
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
          )}

          {reportType === 'class' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Class-wise Report</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Class</th>
                            <th>Students Using Transport</th>
                            <th>Routes Used</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredClassReport.length === 0 ? (
                            <tr>
                              <td colSpan="3" className="text-center text-muted">
                                No data available
                              </td>
                            </tr>
                          ) : (
                            filteredClassReport.map((classData, index) => (
                              <tr key={index}>
                                <td><strong>{classData.className}</strong></td>
                                <td>{classData.studentCount}</td>
                                <td>{classData.routeCount}</td>
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
          )}
        </section>
      </div>
    </main>
  );
};

export default TransportReports;

