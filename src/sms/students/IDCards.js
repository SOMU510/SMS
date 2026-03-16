import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';
import jsPDF from 'jspdf';

const IDCards = () => {
  const { 
    students,
    classes,
    sections,
    settings
  } = useSchool();

  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [cardTemplate, setCardTemplate] = useState('Standard');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter students
  let filteredStudents = students.filter(student =>
    student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedClass !== 'All') {
    filteredStudents = filteredStudents.filter(s => s.class === selectedClass);
  }

  if (selectedSection !== 'All') {
    filteredStudents = filteredStudents.filter(s => s.section === selectedSection);
  }

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

  const handleGenerateIDCard = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const doc = new jsPDF('landscape', 'mm', [85.6, 53.98]); // ID card size
    
    // Background
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 85.6, 53.98, 'F');
    
    // Border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(2, 2, 81.6, 49.98);
    
    // School Logo/Name
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(settings?.schoolName || 'School Name', 42.8, 8, { align: 'center' });
    
    // ID Card Title
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('STUDENT ID CARD', 42.8, 12, { align: 'center' });
    
    // Photo placeholder (circle)
    doc.setFillColor(200, 200, 200);
    doc.circle(15, 25, 8, 'F');
    doc.setFontSize(6);
    doc.text('Photo', 15, 25, { align: 'center' });
    
    // Student Information
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('Name:', 30, 20);
    doc.setFont('helvetica', 'normal');
    doc.text(`${student.firstName} ${student.lastName}`, 30, 25);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Admission No:', 30, 30);
    doc.setFont('helvetica', 'normal');
    doc.text(student.admissionNo || 'N/A', 30, 35);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Class:', 30, 40);
    doc.setFont('helvetica', 'normal');
    doc.text(`${student.class || 'N/A'} - ${student.section || 'N/A'}`, 30, 45);
    
    // Validity
    doc.setFontSize(5);
    doc.text(`Valid until: ${new Date().getFullYear() + 1}`, 42.8, 50, { align: 'center' });
    
    // Save PDF
    const fileName = `IDCard_${student.admissionNo}_${student.firstName}_${student.lastName}.pdf`;
    doc.save(fileName);
  };

  const handleBulkGenerate = () => {
    if (selectedStudents.length === 0) {
      alert('Please select at least one student');
      return;
    }

    selectedStudents.forEach((studentId, index) => {
      setTimeout(() => {
        handleGenerateIDCard(studentId);
      }, index * 500); // Delay each generation
    });
  };

  // Get available sections for selected class
  const availableSections = selectedClass !== 'All'
    ? sections.filter(s => s.className === selectedClass)
    : [];

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>ID Card Generation</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/students">Student Management</Link></li>
              <li className="breadcrumb-item active">ID Card Generation</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row mb-3">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">ID Card Settings</h5>
                  <div className="row">
                    <div className="col-md-3">
                      <label className="form-label">Class</label>
                      <select
                        className="form-select"
                        value={selectedClass}
                        onChange={(e) => {
                          setSelectedClass(e.target.value);
                          setSelectedSection('All');
                        }}
                      >
                        <option value="All">All Classes</option>
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
                        onChange={(e) => setSelectedSection(e.target.value)}
                        disabled={selectedClass === 'All'}
                      >
                        <option value="All">All Sections</option>
                        {availableSections.map(section => (
                          <option key={section.id} value={section.name}>{section.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Card Template</label>
                      <select
                        className="form-select"
                        value={cardTemplate}
                        onChange={(e) => setCardTemplate(e.target.value)}
                      >
                        <option value="Standard">Standard</option>
                        <option value="Modern">Modern</option>
                        <option value="Classic">Classic</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">&nbsp;</label>
                      <button
                        className="btn btn-primary w-100"
                        onClick={handleBulkGenerate}
                        disabled={selectedStudents.length === 0}
                      >
                        <i className="bi bi-printer"></i> Generate Selected ({selectedStudents.length})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title">Student List</h5>
                    <input
                      type="text"
                      className="form-control"
                      style={{ width: '300px' }}
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th style={{ width: '50px' }}>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                              onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                          </th>
                          <th>Admission No</th>
                          <th>Student Name</th>
                          <th>Class</th>
                          <th>Section</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center text-muted">
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
                              <td>{student.class || '-'}</td>
                              <td>{student.section || '-'}</td>
                              <td>
                                <span className={`badge ${student.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                  {student.status}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleGenerateIDCard(student.id)}
                                >
                                  <i className="bi bi-printer"></i> Generate
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

export default IDCards;

