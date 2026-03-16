import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const AssignFees = () => {
  const { 
    students, 
    classes, 
    sections,
    academicYears,
    feeStructures,
    fees,
    addFee
  } = useSchool();

  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedFeeStructure, setSelectedFeeStructure] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Get current academic year
  const currentAcademicYear = academicYears.find(ay => ay.isCurrent) || academicYears[0];
  const currentYearId = currentAcademicYear?.id;

  // Filter sections based on selected class
  const selectedClassObj = classes.find(c => c.name === selectedClass);
  const availableSections = selectedClass && selectedClassObj
    ? sections.filter(s => s.className === selectedClass)
    : [];

  // Filter fee structures
  const filteredStructures = feeStructures.filter(fs => {
    const matchesYear = !selectedAcademicYear || fs.academicYearId === parseInt(selectedAcademicYear);
    const matchesClass = !selectedClass || fs.className === selectedClass;
    const matchesSection = !selectedSection || fs.sectionId === parseInt(selectedSection);
    return matchesYear && matchesClass && matchesSection;
  });

  // Filter students
  let filteredStudents = students.filter(s => {
    const matchesClass = !selectedClass || s.class === selectedClass;
    const matchesSection = !selectedSection || s.section === selectedSection;
    const matchesSearch = !searchTerm || 
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSection && matchesSearch;
  });

  // Set default academic year
  useEffect(() => {
    if (currentYearId && !selectedAcademicYear) {
      setSelectedAcademicYear(currentYearId);
    }
  }, [currentYearId, selectedAcademicYear]);

  const handleStudentSelect = (studentId, checked) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedStudents(filteredStudents.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleAssignFees = () => {
    if (!selectedFeeStructure) {
      alert('Please select a fee structure');
      return;
    }

    if (selectedStudents.length === 0) {
      alert('Please select at least one student');
      return;
    }

    const structure = feeStructures.find(fs => fs.id === parseInt(selectedFeeStructure));
    if (!structure) {
      alert('Fee structure not found');
      return;
    }

    // Create fee records for each selected student
    selectedStudents.forEach(studentId => {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      // Create fee for each fee item in the structure
      structure.feeItems?.forEach(item => {
        const feeData = {
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          class: student.class,
          section: student.section,
          feeType: item.categoryName || 'Fee',
          categoryId: item.categoryId,
          amount: item.amount,
          dueDate: item.dueDate || new Date().toISOString().split('T')[0],
          status: 'Pending',
          paymentMethod: '',
          academicYearId: structure.academicYearId,
          feeStructureId: structure.id
        };

        // Check if fee already exists
        const existing = fees.find(
          f => f.studentId === studentId &&
               f.categoryId === item.categoryId &&
               f.feeStructureId === structure.id
        );

        if (!existing) {
          addFee(feeData);
        }
      });
    });

    alert(`Fees assigned to ${selectedStudents.length} student(s) successfully!`);
    setSelectedStudents([]);
  };

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Assign Fees</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/fees">Fees</Link></li>
              <li className="breadcrumb-item active">Assign Fees</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row mb-3">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Select Fee Structure and Students</h5>
                  <div className="row">
                    <div className="col-md-3">
                      <label className="form-label">Academic Year</label>
                      <select
                        className="form-select"
                        value={selectedAcademicYear}
                        onChange={(e) => {
                          setSelectedAcademicYear(e.target.value);
                          setSelectedClass('');
                          setSelectedSection('');
                          setSelectedFeeStructure('');
                        }}
                      >
                        <option value="">Select Academic Year</option>
                        {academicYears.map(ay => (
                          <option key={ay.id} value={ay.id}>
                            {ay.name} {ay.isCurrent && '(Current)'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Class</label>
                      <select
                        className="form-select"
                        value={selectedClass}
                        onChange={(e) => {
                          setSelectedClass(e.target.value);
                          setSelectedSection('');
                          setSelectedFeeStructure('');
                        }}
                      >
                        <option value="">Select Class</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.name}>{cls.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Section</label>
                      <select
                        className="form-select"
                        value={selectedSection}
                        onChange={(e) => {
                          setSelectedSection(e.target.value);
                          setSelectedFeeStructure('');
                        }}
                        disabled={!selectedClass}
                      >
                        <option value="">All Sections</option>
                        {availableSections.map(section => (
                          <option key={section.id} value={section.id}>{section.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">
                        Fee Structure <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={selectedFeeStructure}
                        onChange={(e) => setSelectedFeeStructure(e.target.value)}
                        disabled={!selectedClass}
                      >
                        <option value="">Select Fee Structure</option>
                        {filteredStructures.map(structure => (
                          <option key={structure.id} value={structure.id}>
                            {structure.className} {structure.sectionName ? `- ${structure.sectionName}` : ''} 
                            (₹{structure.totalAmount?.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {selectedFeeStructure && (
                    <div className="alert alert-info mt-3">
                      <strong>Selected Structure:</strong> {
                        filteredStructures.find(fs => fs.id === parseInt(selectedFeeStructure))?.feeItems?.length || 0
                      } fee items, Total: ₹{
                        filteredStructures.find(fs => fs.id === parseInt(selectedFeeStructure))?.totalAmount?.toLocaleString() || '0'
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {selectedClass && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">Select Students</h5>
                      <div>
                        <input
                          type="text"
                          className="form-control d-inline-block"
                          style={{ width: '250px' }}
                          placeholder="Search students..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          id="selectAll"
                        />
                        <label className="form-check-label" htmlFor="selectAll">
                          <strong>Select All ({filteredStudents.length} students)</strong>
                        </label>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th style={{ width: '50px' }}>Select</th>
                            <th>Admission No</th>
                            <th>Student Name</th>
                            <th>Class</th>
                            <th>Section</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center text-muted">
                                No students found
                              </td>
                            </tr>
                          ) : (
                            filteredStudents.map((student) => (
                              <tr key={student.id}>
                                <td>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={selectedStudents.includes(student.id)}
                                    onChange={(e) => handleStudentSelect(student.id, e.target.checked)}
                                  />
                                </td>
                                <td><strong>{student.admissionNo}</strong></td>
                                <td>{student.firstName} {student.lastName}</td>
                                <td>{student.class}</td>
                                <td>{student.section}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {selectedStudents.length > 0 && (
                      <div className="alert alert-success mt-3">
                        <strong>{selectedStudents.length}</strong> student(s) selected
                      </div>
                    )}

                    <div className="text-end mt-3">
                      <button
                        className="btn btn-primary btn-lg"
                        onClick={handleAssignFees}
                        disabled={!selectedFeeStructure || selectedStudents.length === 0}
                      >
                        <i className="bi bi-check-circle"></i> Assign Fees to Selected Students
                      </button>
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

export default AssignFees;

