import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const AddStaff = () => {
  const navigate = useNavigate();
  const { addStaff, classes, subjects } = useSchool();
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: '',
    aadharNumber: '',
    nationality: 'Indian',
    religion: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Staff Information
    staffType: 'Teacher',
    employeeId: '',
    designation: '',
    department: '',
    qualification: '',
    experience: '',
    specialization: '',
    
    // Academic Information (for teachers)
    subject: '',
    class: '',
    
    // Employment Information
    joiningDate: new Date().toISOString().split('T')[0],
    contractType: 'Permanent',
    salary: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    
    // Documents
    photoUploaded: false,
    resumeUploaded: false,
    certificatesUploaded: false,
    
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    if (!formData.staffType) {
      newErrors.staffType = 'Staff type is required';
    }
    
    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }
    
    if (!formData.joiningDate) {
      newErrors.joiningDate = 'Joining date is required';
    }

    // For teachers, subject is required
    if (formData.staffType === 'Teacher' && !formData.subject) {
      newErrors.subject = 'Subject is required for teachers';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Generate employee ID if not provided
      if (!formData.employeeId) {
        const empId = `EMP${String(Date.now()).slice(-6)}`;
        formData.employeeId = empId;
      }
      
      addStaff(formData);
      alert(`Staff member added successfully! Employee ID: ${formData.employeeId}`);
      navigate('/staff');
    }
  };

  const uniqueClasses = [...new Set(classes.map(c => c.name))].sort();

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Add Staff</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item"><a href="/staff">Staff</a></li>
              <li className="breadcrumb-item active">Add Staff</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Staff Information</h5>
                  <form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <h6 className="mb-3 mt-4">Personal Information</h6>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          First Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Middle Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="middleName"
                          value={formData.middleName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Last Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Phone <span className="text-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Alternate Phone</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="alternatePhone"
                          value={formData.alternatePhone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Date of Birth</label>
                        <input
                          type="date"
                          className="form-control"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Gender</label>
                        <select
                          className="form-select"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Blood Group</label>
                        <select
                          className="form-select"
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Aadhar Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="aadharNumber"
                          value={formData.aadharNumber}
                          onChange={handleChange}
                          maxLength="12"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Nationality</label>
                        <input
                          type="text"
                          className="form-control"
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Address</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          className="form-control"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Pincode</label>
                        <input
                          type="text"
                          className="form-control"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          maxLength="6"
                        />
                      </div>
                    </div>

                    {/* Staff Information */}
                    <h6 className="mb-3 mt-4">Staff Information</h6>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Staff Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.staffType ? 'is-invalid' : ''}`}
                          name="staffType"
                          value={formData.staffType}
                          onChange={handleChange}
                        >
                          <option value="">Select Staff Type</option>
                          <option value="Teacher">Teacher</option>
                          <option value="Principal">Principal</option>
                          <option value="Vice Principal">Vice Principal</option>
                          <option value="Administrator">Administrator</option>
                          <option value="Accountant">Accountant</option>
                          <option value="Librarian">Librarian</option>
                          <option value="Lab Assistant">Lab Assistant</option>
                          <option value="Security">Security</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.staffType && <div className="invalid-feedback">{errors.staffType}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Employee ID</label>
                        <input
                          type="text"
                          className="form-control"
                          name="employeeId"
                          value={formData.employeeId}
                          onChange={handleChange}
                          placeholder="Auto-generated if left empty"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Designation <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.designation ? 'is-invalid' : ''}`}
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                          placeholder="e.g., Senior Teacher, Admin Officer"
                        />
                        {errors.designation && <div className="invalid-feedback">{errors.designation}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Department</label>
                        <input
                          type="text"
                          className="form-control"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          placeholder="e.g., Mathematics, Administration"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Qualification</label>
                        <input
                          type="text"
                          className="form-control"
                          name="qualification"
                          value={formData.qualification}
                          onChange={handleChange}
                          placeholder="e.g., M.Sc., B.Ed."
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Experience</label>
                        <input
                          type="text"
                          className="form-control"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          placeholder="e.g., 5 years"
                        />
                      </div>
                    </div>

                    {/* Academic Information (for teachers) */}
                    {formData.staffType === 'Teacher' && (
                      <>
                        <h6 className="mb-3 mt-4">Academic Information</h6>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">
                              Subject <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`form-select ${errors.subject ? 'is-invalid' : ''}`}
                              name="subject"
                              value={formData.subject}
                              onChange={handleChange}
                            >
                              <option value="">Select Subject</option>
                              {subjects.map(sub => (
                                <option key={sub.id} value={sub.name}>{sub.name}</option>
                              ))}
                            </select>
                            {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Class</label>
                            <select
                              className="form-select"
                              name="class"
                              value={formData.class}
                              onChange={handleChange}
                            >
                              <option value="">Select Class</option>
                              {uniqueClasses.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Specialization</label>
                            <input
                              type="text"
                              className="form-control"
                              name="specialization"
                              value={formData.specialization}
                              onChange={handleChange}
                              placeholder="e.g., Advanced Mathematics, Physics"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Employment Information */}
                    <h6 className="mb-3 mt-4">Employment Information</h6>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Joining Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className={`form-control ${errors.joiningDate ? 'is-invalid' : ''}`}
                          name="joiningDate"
                          value={formData.joiningDate}
                          onChange={handleChange}
                        />
                        {errors.joiningDate && <div className="invalid-feedback">{errors.joiningDate}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Contract Type</label>
                        <select
                          className="form-select"
                          name="contractType"
                          value={formData.contractType}
                          onChange={handleChange}
                        >
                          <option value="Permanent">Permanent</option>
                          <option value="Contract">Contract</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Temporary">Temporary</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Salary</label>
                        <input
                          type="number"
                          className="form-control"
                          name="salary"
                          value={formData.salary}
                          onChange={handleChange}
                          placeholder="Monthly salary"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
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
                      <div className="col-md-4">
                        <label className="form-label">Account Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="accountNumber"
                          value={formData.accountNumber}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">IFSC Code</label>
                        <input
                          type="text"
                          className="form-control"
                          name="ifscCode"
                          value={formData.ifscCode}
                          onChange={handleChange}
                          maxLength="11"
                        />
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <h6 className="mb-3 mt-4">Emergency Contact</h6>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Contact Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="emergencyContactName"
                          value={formData.emergencyContactName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Contact Phone</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="emergencyContactPhone"
                          value={formData.emergencyContactPhone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Relation</label>
                        <input
                          type="text"
                          className="form-control"
                          name="emergencyContactRelation"
                          value={formData.emergencyContactRelation}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Documents Checklist */}
                    <h6 className="mb-3 mt-4">Documents Checklist</h6>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="photoUploaded"
                            checked={formData.photoUploaded}
                            onChange={handleChange}
                          />
                          <label className="form-check-label">Photo Uploaded</label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="resumeUploaded"
                            checked={formData.resumeUploaded}
                            onChange={handleChange}
                          />
                          <label className="form-check-label">Resume Uploaded</label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="certificatesUploaded"
                            checked={formData.certificatesUploaded}
                            onChange={handleChange}
                          />
                          <label className="form-check-label">Certificates Uploaded</label>
                        </div>
                      </div>
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
                          <option value="On Leave">On Leave</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate('/staff')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> Save Staff
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

export default AddStaff;

