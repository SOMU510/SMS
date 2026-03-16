import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const FeeStructure = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { 
    feeStructures,
    classes,
    sections,
    academicYears,
    feeCategories,
    addFeeStructure,
    updateFeeStructure,
    deleteFeeStructure
  } = useSchool();
  
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    academicYearId: '',
    className: '',
    sectionId: '',
    feeItems: [
      { categoryId: '', categoryName: '', amount: 0, dueDate: '', isOptional: false }
    ],
    totalAmount: 0,
    status: 'Active',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [filterAcademicYear, setFilterAcademicYear] = useState('All');

  // Get current academic year
  const currentAcademicYear = academicYears.find(ay => ay.isCurrent) || academicYears[0];
  const currentYearId = currentAcademicYear?.id;

  // Filter sections based on selected class
  const selectedClassObj = classes.find(c => c.name === formData.className);
  const availableSections = formData.className && selectedClassObj
    ? sections.filter(s => s.className === formData.className)
    : [];

  // Load fee structure data if editing
  useEffect(() => {
    if (isEditMode) {
      const structure = feeStructures.find(fs => fs.id === parseInt(id));
      if (structure) {
        setFormData({
          academicYearId: structure.academicYearId || currentYearId || '',
          className: structure.className || '',
          sectionId: structure.sectionId || '',
          feeItems: structure.feeItems || formData.feeItems,
          totalAmount: structure.totalAmount || 0,
          status: structure.status || 'Active',
          description: structure.description || ''
        });
      }
    } else if (isAddMode) {
      setFormData(prev => ({
        ...prev,
        academicYearId: currentYearId || ''
      }));
    }
  }, [id, isEditMode, isAddMode, feeStructures, currentYearId]);

  // Calculate total amount
  useEffect(() => {
    const total = formData.feeItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    setFormData(prev => ({ ...prev, totalAmount: total }));
  }, [formData.feeItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'className' && { sectionId: '' })
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFeeItemChange = (index, field, value) => {
    const updatedItems = [...formData.feeItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'amount' ? parseFloat(value) || 0 : 
               field === 'isOptional' ? value : 
               field === 'categoryId' ? value : value
    };
    
    // Update category name when category ID changes
    if (field === 'categoryId') {
      const category = feeCategories.find(fc => fc.id === parseInt(value));
      updatedItems[index].categoryName = category?.name || '';
    }
    
    setFormData(prev => ({ ...prev, feeItems: updatedItems }));
  };

  const addFeeItem = () => {
    setFormData(prev => ({
      ...prev,
      feeItems: [
        ...prev.feeItems,
        { categoryId: '', categoryName: '', amount: 0, dueDate: '', isOptional: false }
      ]
    }));
  };

  const removeFeeItem = (index) => {
    if (formData.feeItems.length > 1) {
      const updatedItems = formData.feeItems.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, feeItems: updatedItems }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.academicYearId) {
      newErrors.academicYearId = 'Academic year is required';
    }
    
    if (!formData.className) {
      newErrors.className = 'Class is required';
    }

    // Validate fee items
    formData.feeItems.forEach((item, index) => {
      if (!item.categoryId) {
        newErrors[`category_${index}`] = 'Fee category is required';
      }
      if (!item.amount || item.amount <= 0) {
        newErrors[`amount_${index}`] = 'Valid amount is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const selectedSection = sections.find(s => s.id === parseInt(formData.sectionId));
      const selectedAcademicYear = academicYears.find(ay => ay.id === parseInt(formData.academicYearId));

      const structureData = {
        ...formData,
        sectionName: selectedSection?.name || '',
        academicYearName: selectedAcademicYear?.name || ''
      };

      if (isEditMode) {
        updateFeeStructure(parseInt(id), structureData);
        alert('Fee structure updated successfully!');
      } else {
        // Check for duplicate structure
        const existing = feeStructures.find(
          fs => fs.academicYearId === parseInt(formData.academicYearId) &&
               fs.className === formData.className &&
               fs.sectionId === parseInt(formData.sectionId)
        );
        
        if (existing) {
          alert('A fee structure already exists for this class and section!');
          return;
        }
        
        addFeeStructure(structureData);
        alert('Fee structure created successfully!');
      }
      navigate('/fees/structure');
    }
  };

  const handleDelete = (structureId, className, sectionName) => {
    if (window.confirm(`Are you sure you want to delete fee structure for ${className} ${sectionName ? `- ${sectionName}` : ''}?`)) {
      deleteFeeStructure(structureId);
    }
  };

  // Filter structures
  let filteredStructures = feeStructures.filter(structure =>
    structure.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    structure.sectionName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    structure.academicYearName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterClass !== 'All') {
    filteredStructures = filteredStructures.filter(s => s.className === filterClass);
  }

  if (filterAcademicYear !== 'All') {
    filteredStructures = filteredStructures.filter(s => s.academicYearId === parseInt(filterAcademicYear));
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
            <h1>Fee Structure</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/fees">Fees</Link></li>
                <li className="breadcrumb-item active">Fee Structure</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Fee Structures</h5>
                      <Link to="/fees/structure/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Add Fee Structure
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by class, section..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-select"
                          value={filterClass}
                          onChange={(e) => setFilterClass(e.target.value)}
                        >
                          <option value="All">All Classes</option>
                          {classes.map(cls => (
                            <option key={cls.id} value={cls.name}>{cls.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-select"
                          value={filterAcademicYear}
                          onChange={(e) => setFilterAcademicYear(e.target.value)}
                        >
                          <option value="All">All Academic Years</option>
                          {academicYears.map(ay => (
                            <option key={ay.id} value={ay.id}>{ay.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Academic Year</th>
                            <th>Class</th>
                            <th>Section</th>
                            <th>Total Amount</th>
                            <th>Fee Items</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStructures.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="text-center">
                                <p className="text-muted">No fee structures found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredStructures.map((structure) => (
                              <tr key={structure.id}>
                                <td>{structure.academicYearName || '-'}</td>
                                <td><strong>{structure.className || '-'}</strong></td>
                                <td>{structure.sectionName || '-'}</td>
                                <td>₹{structure.totalAmount?.toLocaleString() || '0'}</td>
                                <td>{structure.feeItems?.length || 0} items</td>
                                <td>
                                  <span className={`badge ${getStatusBadge(structure.status)}`}>
                                    {structure.status}
                                  </span>
                                </td>
                                <td>
                                  <Link
                                    to={`/fees/structure/${structure.id}`}
                                    className="btn btn-sm btn-primary me-1"
                                    title="Edit"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(structure.id, structure.className, structure.sectionName)}
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

  // Form view
  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>{isEditMode ? 'Edit Fee Structure' : 'Add Fee Structure'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/fees/structure">Fee Structure</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Add'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Structure Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Academic Year <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.academicYearId ? 'is-invalid' : ''}`}
                          name="academicYearId"
                          value={formData.academicYearId}
                          onChange={handleChange}
                        >
                          <option value="">Select Academic Year</option>
                          {academicYears.map(ay => (
                            <option key={ay.id} value={ay.id}>
                              {ay.name} {ay.isCurrent && '(Current)'}
                            </option>
                          ))}
                        </select>
                        {errors.academicYearId && <div className="invalid-feedback">{errors.academicYearId}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Class <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.className ? 'is-invalid' : ''}`}
                          name="className"
                          value={formData.className}
                          onChange={handleChange}
                        >
                          <option value="">Select Class</option>
                          {classes.map(cls => (
                            <option key={cls.id} value={cls.name}>{cls.name}</option>
                          ))}
                        </select>
                        {errors.className && <div className="invalid-feedback">{errors.className}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Section (Optional)</label>
                        <select
                          className="form-select"
                          name="sectionId"
                          value={formData.sectionId}
                          onChange={handleChange}
                          disabled={!formData.className}
                        >
                          <option value="">All Sections</option>
                          {availableSections.map(section => (
                            <option key={section.id} value={section.id}>{section.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <h5 className="card-title mt-4 mb-3">Fee Items</h5>
                    <div className="table-responsive mb-3">
                      <table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>Fee Category</th>
                            <th>Amount (₹)</th>
                            <th>Due Date</th>
                            <th>Optional</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.feeItems.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <select
                                  className={`form-select form-select-sm ${errors[`category_${index}`] ? 'is-invalid' : ''}`}
                                  value={item.categoryId}
                                  onChange={(e) => handleFeeItemChange(index, 'categoryId', e.target.value)}
                                >
                                  <option value="">Select Category</option>
                                  {feeCategories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                  ))}
                                </select>
                                {errors[`category_${index}`] && <div className="invalid-feedback">{errors[`category_${index}`]}</div>}
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className={`form-control form-control-sm ${errors[`amount_${index}`] ? 'is-invalid' : ''}`}
                                  value={item.amount}
                                  onChange={(e) => handleFeeItemChange(index, 'amount', e.target.value)}
                                  min="0"
                                  step="0.01"
                                />
                                {errors[`amount_${index}`] && <div className="invalid-feedback">{errors[`amount_${index}`]}</div>}
                              </td>
                              <td>
                                <input
                                  type="date"
                                  className="form-control form-control-sm"
                                  value={item.dueDate}
                                  onChange={(e) => handleFeeItemChange(index, 'dueDate', e.target.value)}
                                />
                              </td>
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={item.isOptional}
                                  onChange={(e) => handleFeeItemChange(index, 'isOptional', e.target.checked)}
                                />
                              </td>
                              <td>
                                {formData.feeItems.length > 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => removeFeeItem(index)}
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
                      onClick={addFeeItem}
                    >
                      <i className="bi bi-plus"></i> Add Fee Item
                    </button>

                    <div className="alert alert-info">
                      <strong>Total Amount: ₹{formData.totalAmount.toLocaleString()}</strong>
                    </div>

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
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Additional notes or description"
                        />
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate('/fees/structure')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Create'} Fee Structure
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

export default FeeStructure;

