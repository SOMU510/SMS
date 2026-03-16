import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';
import './StudentForm.css';

const StudentAdmission = () => {
  const navigate = useNavigate();
  const { addStudent, classes } = useSchool();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: '',
    aadharNumber: '',
    nationality: 'Indian',
    religion: '',
    caste: '',
    motherTongue: '',
    
    // Contact Information
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    permanentAddress: '',
    
    // Admission Details
    admissionDate: new Date().toISOString().split('T')[0],
    academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
    class: '',
    section: 'A',
    admissionCategory: 'Regular',
    previousSchool: '',
    previousClass: '',
    tcNumber: '',
    tcDate: '',
    
    // Parent/Guardian Information
    fatherName: '',
    fatherOccupation: '',
    fatherEducation: '',
    fatherPhone: '',
    fatherEmail: '',
    fatherAadhar: '',
    
    motherName: '',
    motherOccupation: '',
    motherEducation: '',
    motherPhone: '',
    motherEmail: '',
    motherAadhar: '',
    
    guardianName: '',
    guardianRelation: '',
    guardianOccupation: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianAddress: '',
    
    // Medical Information
    medicalConditions: '',
    allergies: '',
    medications: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    
    // Documents
    photoUploaded: false,
    birthCertificate: false,
    previousTc: false,
    aadharCard: false,
    casteCertificate: false,
    
    status: 'Pending'
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

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
    }
    
    if (step === 2) {
      if (!formData.class) newErrors.class = 'Class is required';
      if (!formData.admissionDate) newErrors.admissionDate = 'Admission date is required';
    }
    
    if (step === 3) {
      if (!formData.fatherName.trim()) newErrors.fatherName = 'Father name is required';
      if (!formData.fatherPhone.trim()) newErrors.fatherPhone = 'Father phone is required';
      if (!formData.motherName.trim()) newErrors.motherName = 'Mother name is required';
      if (!formData.motherPhone.trim()) newErrors.motherPhone = 'Mother phone is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      // Generate admission number
      const admissionNo = `ADM${String(Date.now()).slice(-6)}`;
      
      const studentData = {
        ...formData,
        admissionNo,
        parentName: formData.fatherName || formData.guardianName,
        parentPhone: formData.fatherPhone || formData.guardianPhone,
        status: 'Active'
      };
      
      addStudent(studentData);
      alert(`Student admitted successfully! Admission Number: ${admissionNo}`);
      navigate('/students');
    }
  };

  const uniqueClasses = [...new Set(classes.map(c => c.name))].sort();

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Student Admission</h1>
        </div>
        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  {/* Progress Steps */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <ul className="nav nav-pills nav-justified" role="tablist">
                        <li className="nav-item">
                          <span className={`nav-link ${currentStep >= 1 ? 'active' : ''}`}>
                            <i className="bi bi-person"></i> Personal Info
                          </span>
                        </li>
                        <li className="nav-item">
                          <span className={`nav-link ${currentStep >= 2 ? 'active' : ''}`}>
                            <i className="bi bi-book"></i> Admission Details
                          </span>
                        </li>
                        <li className="nav-item">
                          <span className={`nav-link ${currentStep >= 3 ? 'active' : ''}`}>
                            <i className="bi bi-people"></i> Parent/Guardian
                          </span>
                        </li>
                        <li className="nav-item">
                          <span className={`nav-link ${currentStep >= 4 ? 'active' : ''}`}>
                            <i className="bi bi-file-medical"></i> Medical & Documents
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                      <div>
                        <h5 className="card-title mb-3">Personal Information</h5>
                        <div className="row mb-3">
                          <div className="col-md-4">
                            <label className="form-label">First Name <span className="text-danger">*</span></label>
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
                            <label className="form-label">Last Name <span className="text-danger">*</span></label>
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
                            <label className="form-label">Date of Birth <span className="text-danger">*</span></label>
                            <input
                              type="date"
                              className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleChange}
                            />
                            {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Gender <span className="text-danger">*</span></label>
                            <select
                              className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                            {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Blood Group</label>
                            <select className="form-select" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
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
                          <div className="col-md-4">
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
                          <div className="col-md-4">
                            <label className="form-label">Nationality</label>
                            <input
                              type="text"
                              className="form-control"
                              name="nationality"
                              value={formData.nationality}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Religion</label>
                            <input
                              type="text"
                              className="form-control"
                              name="religion"
                              value={formData.religion}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Email <span className="text-danger">*</span></label>
                            <input
                              type="email"
                              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Phone <span className="text-danger">*</span></label>
                            <input
                              type="tel"
                              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-12">
                            <label className="form-label">Address <span className="text-danger">*</span></label>
                            <textarea
                              className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                              rows="3"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                            />
                            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
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

                        <div className="text-end">
                          <button type="button" className="btn btn-primary" onClick={handleNext}>
                            Next <i className="bi bi-arrow-right"></i>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Admission Details */}
                    {currentStep === 2 && (
                      <div>
                        <h5 className="card-title mb-3">Admission Details</h5>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Academic Year</label>
                            <input
                              type="text"
                              className="form-control"
                              name="academicYear"
                              value={formData.academicYear}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Admission Date <span className="text-danger">*</span></label>
                            <input
                              type="date"
                              className={`form-control ${errors.admissionDate ? 'is-invalid' : ''}`}
                              name="admissionDate"
                              value={formData.admissionDate}
                              onChange={handleChange}
                            />
                            {errors.admissionDate && <div className="invalid-feedback">{errors.admissionDate}</div>}
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Class <span className="text-danger">*</span></label>
                            <select
                              className={`form-select ${errors.class ? 'is-invalid' : ''}`}
                              name="class"
                              value={formData.class}
                              onChange={handleChange}
                            >
                              <option value="">Select Class</option>
                              {uniqueClasses.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                              ))}
                            </select>
                            {errors.class && <div className="invalid-feedback">{errors.class}</div>}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Section</label>
                            <select className="form-select" name="section" value={formData.section} onChange={handleChange}>
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                              <option value="D">D</option>
                            </select>
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Admission Category</label>
                            <select className="form-select" name="admissionCategory" value={formData.admissionCategory} onChange={handleChange}>
                              <option value="Regular">Regular</option>
                              <option value="Transfer">Transfer</option>
                              <option value="Re-admission">Re-admission</option>
                              <option value="Lateral Entry">Lateral Entry</option>
                            </select>
                          </div>
                        </div>

                        <h6 className="mt-4 mb-3">Previous School Information (if applicable)</h6>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Previous School Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="previousSchool"
                              value={formData.previousSchool}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Previous Class</label>
                            <input
                              type="text"
                              className="form-control"
                              name="previousClass"
                              value={formData.previousClass}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">TC Number</label>
                            <input
                              type="text"
                              className="form-control"
                              name="tcNumber"
                              value={formData.tcNumber}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">TC Date</label>
                            <input
                              type="date"
                              className="form-control"
                              name="tcDate"
                              value={formData.tcDate}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="text-end">
                          <button type="button" className="btn btn-secondary me-2" onClick={handlePrevious}>
                            <i className="bi bi-arrow-left"></i> Previous
                          </button>
                          <button type="button" className="btn btn-primary" onClick={handleNext}>
                            Next <i className="bi bi-arrow-right"></i>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Parent/Guardian Information */}
                    {currentStep === 3 && (
                      <div>
                        <h5 className="card-title mb-3">Parent/Guardian Information</h5>
                        
                        <h6 className="mt-3 mb-3">Father's Information</h6>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Father's Name <span className="text-danger">*</span></label>
                            <input
                              type="text"
                              className={`form-control ${errors.fatherName ? 'is-invalid' : ''}`}
                              name="fatherName"
                              value={formData.fatherName}
                              onChange={handleChange}
                            />
                            {errors.fatherName && <div className="invalid-feedback">{errors.fatherName}</div>}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Occupation</label>
                            <input
                              type="text"
                              className="form-control"
                              name="fatherOccupation"
                              value={formData.fatherOccupation}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-4">
                            <label className="form-label">Education</label>
                            <input
                              type="text"
                              className="form-control"
                              name="fatherEducation"
                              value={formData.fatherEducation}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Phone <span className="text-danger">*</span></label>
                            <input
                              type="tel"
                              className={`form-control ${errors.fatherPhone ? 'is-invalid' : ''}`}
                              name="fatherPhone"
                              value={formData.fatherPhone}
                              onChange={handleChange}
                            />
                            {errors.fatherPhone && <div className="invalid-feedback">{errors.fatherPhone}</div>}
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              name="fatherEmail"
                              value={formData.fatherEmail}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <h6 className="mt-4 mb-3">Mother's Information</h6>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Mother's Name <span className="text-danger">*</span></label>
                            <input
                              type="text"
                              className={`form-control ${errors.motherName ? 'is-invalid' : ''}`}
                              name="motherName"
                              value={formData.motherName}
                              onChange={handleChange}
                            />
                            {errors.motherName && <div className="invalid-feedback">{errors.motherName}</div>}
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Occupation</label>
                            <input
                              type="text"
                              className="form-control"
                              name="motherOccupation"
                              value={formData.motherOccupation}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-4">
                            <label className="form-label">Education</label>
                            <input
                              type="text"
                              className="form-control"
                              name="motherEducation"
                              value={formData.motherEducation}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Phone <span className="text-danger">*</span></label>
                            <input
                              type="tel"
                              className={`form-control ${errors.motherPhone ? 'is-invalid' : ''}`}
                              name="motherPhone"
                              value={formData.motherPhone}
                              onChange={handleChange}
                            />
                            {errors.motherPhone && <div className="invalid-feedback">{errors.motherPhone}</div>}
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              name="motherEmail"
                              value={formData.motherEmail}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <h6 className="mt-4 mb-3">Guardian Information (if different from parents)</h6>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Guardian Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="guardianName"
                              value={formData.guardianName}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Relation</label>
                            <input
                              type="text"
                              className="form-control"
                              name="guardianRelation"
                              value={formData.guardianRelation}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Occupation</label>
                            <input
                              type="text"
                              className="form-control"
                              name="guardianOccupation"
                              value={formData.guardianOccupation}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Phone</label>
                            <input
                              type="tel"
                              className="form-control"
                              name="guardianPhone"
                              value={formData.guardianPhone}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="text-end">
                          <button type="button" className="btn btn-secondary me-2" onClick={handlePrevious}>
                            <i className="bi bi-arrow-left"></i> Previous
                          </button>
                          <button type="button" className="btn btn-primary" onClick={handleNext}>
                            Next <i className="bi bi-arrow-right"></i>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Medical & Documents */}
                    {currentStep === 4 && (
                      <div>
                        <h5 className="card-title mb-3">Medical Information & Documents</h5>
                        
                        <h6 className="mt-3 mb-3">Medical Information</h6>
                        <div className="row mb-3">
                          <div className="col-md-12">
                            <label className="form-label">Medical Conditions</label>
                            <textarea
                              className="form-control"
                              rows="3"
                              name="medicalConditions"
                              value={formData.medicalConditions}
                              onChange={handleChange}
                              placeholder="Any existing medical conditions..."
                            />
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Allergies</label>
                            <input
                              type="text"
                              className="form-control"
                              name="allergies"
                              value={formData.allergies}
                              onChange={handleChange}
                              placeholder="List any allergies..."
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Current Medications</label>
                            <input
                              type="text"
                              className="form-control"
                              name="medications"
                              value={formData.medications}
                              onChange={handleChange}
                              placeholder="List any medications..."
                            />
                          </div>
                        </div>

                        <h6 className="mt-4 mb-3">Emergency Contact</h6>
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

                        <h6 className="mt-4 mb-3">Documents Checklist</h6>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="photoUploaded"
                                checked={formData.photoUploaded}
                                onChange={handleChange}
                              />
                              <label className="form-check-label">Student Photo</label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="birthCertificate"
                                checked={formData.birthCertificate}
                                onChange={handleChange}
                              />
                              <label className="form-check-label">Birth Certificate</label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="previousTc"
                                checked={formData.previousTc}
                                onChange={handleChange}
                              />
                              <label className="form-check-label">Previous School TC</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="aadharCard"
                                checked={formData.aadharCard}
                                onChange={handleChange}
                              />
                              <label className="form-check-label">Aadhar Card</label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="casteCertificate"
                                checked={formData.casteCertificate}
                                onChange={handleChange}
                              />
                              <label className="form-check-label">Caste Certificate (if applicable)</label>
                            </div>
                          </div>
                        </div>

                        <div className="text-end">
                          <button type="button" className="btn btn-secondary me-2" onClick={handlePrevious}>
                            <i className="bi bi-arrow-left"></i> Previous
                          </button>
                          <button type="submit" className="btn btn-success">
                            <i className="bi bi-check-circle"></i> Submit Admission
                          </button>
                        </div>
                      </div>
                    )}
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

export default StudentAdmission;

