import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const Routes = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { 
    routes,
    vehicles,
    drivers,
    addRoute,
    updateRoute,
    deleteRoute
  } = useSchool();
  
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    routeName: '',
    routeNumber: '',
    startPoint: '',
    endPoint: '',
    distance: '',
    estimatedTime: '',
    vehicleId: '',
    driverId: '',
    pickupPoints: [
      { name: '', time: '', sequence: 1 }
    ],
    dropPoints: [
      { name: '', time: '', sequence: 1 }
    ],
    status: 'Active',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Load route data if editing
  useEffect(() => {
    if (isEditMode) {
      const route = routes.find(r => r.id === parseInt(id));
      if (route) {
        setFormData({
          routeName: route.routeName || '',
          routeNumber: route.routeNumber || '',
          startPoint: route.startPoint || '',
          endPoint: route.endPoint || '',
          distance: route.distance || '',
          estimatedTime: route.estimatedTime || '',
          vehicleId: route.vehicleId || '',
          driverId: route.driverId || '',
          pickupPoints: route.pickupPoints || [{ name: '', time: '', sequence: 1 }],
          dropPoints: route.dropPoints || [{ name: '', time: '', sequence: 1 }],
          status: route.status || 'Active',
          notes: route.notes || ''
        });
      }
    }
  }, [id, isEditMode, routes]);

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

  const handlePointChange = (type, index, field, value) => {
    const points = type === 'pickup' ? [...formData.pickupPoints] : [...formData.dropPoints];
    points[index] = {
      ...points[index],
      [field]: field === 'sequence' ? parseInt(value) : value
    };
    setFormData(prev => ({
      ...prev,
      [type === 'pickup' ? 'pickupPoints' : 'dropPoints']: points
    }));
  };

  const addPoint = (type) => {
    const points = type === 'pickup' ? formData.pickupPoints : formData.dropPoints;
    const newPoint = {
      name: '',
      time: '',
      sequence: points.length + 1
    };
    setFormData(prev => ({
      ...prev,
      [type === 'pickup' ? 'pickupPoints' : 'dropPoints']: [...points, newPoint]
    }));
  };

  const removePoint = (type, index) => {
    const points = type === 'pickup' ? formData.pickupPoints : formData.dropPoints;
    if (points.length > 1) {
      const updatedPoints = points.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        [type === 'pickup' ? 'pickupPoints' : 'dropPoints']: updatedPoints
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.routeName.trim()) {
      newErrors.routeName = 'Route name is required';
    }
    
    if (!formData.routeNumber.trim()) {
      newErrors.routeNumber = 'Route number is required';
    }
    
    if (!formData.startPoint.trim()) {
      newErrors.startPoint = 'Start point is required';
    }
    
    if (!formData.endPoint.trim()) {
      newErrors.endPoint = 'End point is required';
    }
    
    if (!formData.distance || parseFloat(formData.distance) <= 0) {
      newErrors.distance = 'Valid distance is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const routeData = {
        ...formData,
        distance: parseFloat(formData.distance)
      };

      if (isEditMode) {
        updateRoute(parseInt(id), routeData);
        alert('Route updated successfully!');
      } else {
        // Check for duplicate route number
        const existing = routes.find(r => r.routeNumber.toLowerCase() === formData.routeNumber.toLowerCase());
        if (existing) {
          alert('Route with this number already exists!');
          return;
        }
        addRoute(routeData);
        alert('Route added successfully!');
      }
      navigate('/transport/routes');
    }
  };

  const handleDelete = (routeId, routeName) => {
    if (window.confirm(`Are you sure you want to delete route ${routeName}?`)) {
      deleteRoute(routeId);
    }
  };

  // Filter routes
  let filteredRoutes = routes.filter(route =>
    route.routeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.routeNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.startPoint?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.endPoint?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterStatus !== 'All') {
    filteredRoutes = filteredRoutes.filter(r => r.status === filterStatus);
  }

  const getStatusBadge = (status) => {
    return status === 'Active' ? 'bg-success' : 'bg-secondary';
  };

  // If not in add/edit mode, show list view
  if (!showForm) {
    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Routes</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/transport">Transport</Link></li>
                <li className="breadcrumb-item active">Routes</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Routes</h5>
                      <Link to="/transport/routes/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Add Route
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by route name, number..."
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
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Route Number</th>
                            <th>Route Name</th>
                            <th>Start Point</th>
                            <th>End Point</th>
                            <th>Distance (km)</th>
                            <th>Estimated Time</th>
                            <th>Vehicle</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRoutes.length === 0 ? (
                            <tr>
                              <td colSpan="9" className="text-center">
                                <p className="text-muted">No routes found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredRoutes.map((route) => {
                              const vehicle = vehicles.find(v => v.id === route.vehicleId);
                              return (
                                <tr key={route.id}>
                                  <td><strong>{route.routeNumber}</strong></td>
                                  <td>{route.routeName}</td>
                                  <td>{route.startPoint}</td>
                                  <td>{route.endPoint}</td>
                                  <td>{route.distance} km</td>
                                  <td>{route.estimatedTime || '-'}</td>
                                  <td>{vehicle ? vehicle.vehicleNumber : '-'}</td>
                                  <td>
                                    <span className={`badge ${getStatusBadge(route.status)}`}>
                                      {route.status}
                                    </span>
                                  </td>
                                  <td>
                                    <Link
                                      to={`/transport/routes/${route.id}`}
                                      className="btn btn-sm btn-primary me-1"
                                      title="Edit"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </Link>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleDelete(route.id, route.routeName)}
                                      title="Delete"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
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
  }

  // Form view
  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>{isEditMode ? 'Edit Route' : 'Add Route'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/transport/routes">Routes</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Add'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Route Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Route Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.routeNumber ? 'is-invalid' : ''}`}
                          name="routeNumber"
                          value={formData.routeNumber}
                          onChange={handleChange}
                          placeholder="e.g., R001"
                        />
                        {errors.routeNumber && <div className="invalid-feedback">{errors.routeNumber}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Route Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.routeName ? 'is-invalid' : ''}`}
                          name="routeName"
                          value={formData.routeName}
                          onChange={handleChange}
                          placeholder="e.g., Downtown Route"
                        />
                        {errors.routeName && <div className="invalid-feedback">{errors.routeName}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Distance (km) <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className={`form-control ${errors.distance ? 'is-invalid' : ''}`}
                          name="distance"
                          value={formData.distance}
                          onChange={handleChange}
                          min="0"
                          step="0.1"
                        />
                        {errors.distance && <div className="invalid-feedback">{errors.distance}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Start Point <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.startPoint ? 'is-invalid' : ''}`}
                          name="startPoint"
                          value={formData.startPoint}
                          onChange={handleChange}
                          placeholder="e.g., School Main Gate"
                        />
                        {errors.startPoint && <div className="invalid-feedback">{errors.startPoint}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          End Point <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.endPoint ? 'is-invalid' : ''}`}
                          name="endPoint"
                          value={formData.endPoint}
                          onChange={handleChange}
                          placeholder="e.g., City Center"
                        />
                        {errors.endPoint && <div className="invalid-feedback">{errors.endPoint}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Estimated Time</label>
                        <input
                          type="text"
                          className="form-control"
                          name="estimatedTime"
                          value={formData.estimatedTime}
                          onChange={handleChange}
                          placeholder="e.g., 45 minutes"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Assigned Vehicle</label>
                        <select
                          className="form-select"
                          name="vehicleId"
                          value={formData.vehicleId}
                          onChange={handleChange}
                        >
                          <option value="">Select Vehicle</option>
                          {vehicles.filter(v => v.status === 'Active').map(vehicle => (
                            <option key={vehicle.id} value={vehicle.id}>
                              {vehicle.vehicleNumber} - {vehicle.vehicleType}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Assigned Driver</label>
                        <select
                          className="form-select"
                          name="driverId"
                          value={formData.driverId}
                          onChange={handleChange}
                        >
                          <option value="">Select Driver</option>
                          {drivers.filter(d => d.status === 'Active').map(driver => (
                            <option key={driver.id} value={driver.id}>
                              {driver.firstName} {driver.lastName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <h6 className="card-title mt-4 mb-3">Pickup Points</h6>
                    <div className="table-responsive mb-3">
                      <table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>Sequence</th>
                            <th>Point Name</th>
                            <th>Pickup Time</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.pickupPoints.map((point, index) => (
                            <tr key={index}>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={point.sequence}
                                  onChange={(e) => handlePointChange('pickup', index, 'sequence', e.target.value)}
                                  min="1"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={point.name}
                                  onChange={(e) => handlePointChange('pickup', index, 'name', e.target.value)}
                                  placeholder="Point name"
                                />
                              </td>
                              <td>
                                <input
                                  type="time"
                                  className="form-control form-control-sm"
                                  value={point.time}
                                  onChange={(e) => handlePointChange('pickup', index, 'time', e.target.value)}
                                />
                              </td>
                              <td>
                                {formData.pickupPoints.length > 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => removePoint('pickup', index)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary mb-3"
                      onClick={() => addPoint('pickup')}
                    >
                      <i className="bi bi-plus"></i> Add Pickup Point
                    </button>

                    <h6 className="card-title mt-4 mb-3">Drop Points</h6>
                    <div className="table-responsive mb-3">
                      <table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>Sequence</th>
                            <th>Point Name</th>
                            <th>Drop Time</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.dropPoints.map((point, index) => (
                            <tr key={index}>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={point.sequence}
                                  onChange={(e) => handlePointChange('drop', index, 'sequence', e.target.value)}
                                  min="1"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  value={point.name}
                                  onChange={(e) => handlePointChange('drop', index, 'name', e.target.value)}
                                  placeholder="Point name"
                                />
                              </td>
                              <td>
                                <input
                                  type="time"
                                  className="form-control form-control-sm"
                                  value={point.time}
                                  onChange={(e) => handlePointChange('drop', index, 'time', e.target.value)}
                                />
                              </td>
                              <td>
                                {formData.dropPoints.length > 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => removePoint('drop', index)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary mb-3"
                      onClick={() => addPoint('drop')}
                    >
                      <i className="bi bi-plus"></i> Add Drop Point
                    </button>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Notes</label>
                        <textarea
                          className="form-control"
                          name="notes"
                          value={formData.notes}
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
                        onClick={() => navigate('/transport/routes')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Add'} Route
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

export default Routes;

