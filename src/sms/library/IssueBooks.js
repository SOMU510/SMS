import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const IssueBooks = () => {
  const { 
    students,
    teachers,
    books,
    bookIssues,
    addBookIssue
  } = useSchool();

  const [formData, setFormData] = useState({
    borrowerType: 'Student', // Student, Teacher
    borrowerId: '',
    bookId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    returnDate: '',
    fineAmount: 0,
    status: 'Issued',
    remarks: ''
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterBorrower, setFilterBorrower] = useState('All');

  // Calculate due date (default 14 days from issue date)
  useEffect(() => {
    if (formData.issueDate) {
      const issueDate = new Date(formData.issueDate);
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + 14); // 14 days default
      setFormData(prev => ({
        ...prev,
        dueDate: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.issueDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'borrowerType' && { borrowerId: '' })
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
    
    if (!formData.borrowerId) {
      newErrors.borrowerId = 'Borrower is required';
    }
    
    if (!formData.bookId) {
      newErrors.bookId = 'Book is required';
    }
    
    if (!formData.issueDate) {
      newErrors.issueDate = 'Issue date is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    // Check if book is available
    const selectedBook = books.find(b => b.id === parseInt(formData.bookId));
    if (selectedBook && selectedBook.availableCopies <= 0) {
      newErrors.bookId = 'This book is not available';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleIssue = () => {
    if (validate()) {
      const borrower = formData.borrowerType === 'Student'
        ? students.find(s => s.id === parseInt(formData.borrowerId))
        : teachers.find(t => t.id === parseInt(formData.borrowerId));
      
      const book = books.find(b => b.id === parseInt(formData.bookId));
      
      if (!borrower || !book) {
        alert('Borrower or book not found');
        return;
      }

      if (book.availableCopies <= 0) {
        alert('This book is not available');
        return;
      }

      const issueData = {
        borrowerType: formData.borrowerType,
        borrowerId: parseInt(formData.borrowerId),
        borrowerName: formData.borrowerType === 'Student'
          ? `${borrower.firstName} ${borrower.lastName}`
          : `${borrower.firstName} ${borrower.lastName}`,
        borrowerNumber: formData.borrowerType === 'Student' ? borrower.admissionNo : borrower.employeeId,
        bookId: parseInt(formData.bookId),
        bookTitle: book.title,
        bookIsbn: book.isbn,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        returnDate: null,
        fineAmount: 0,
        status: 'Issued',
        remarks: formData.remarks
      };

      addBookIssue(issueData);
      
      // Update book available copies
      const updatedBook = {
        ...book,
        availableCopies: (book.availableCopies || 0) - 1
      };
      // Note: In real app, you'd call updateBook function here
      
      alert('Book issued successfully!');
      
      // Reset form
      setFormData({
        borrowerType: 'Student',
        borrowerId: '',
        bookId: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        returnDate: '',
        fineAmount: 0,
        status: 'Issued',
        remarks: ''
      });
    }
  };

  // Filter issues
  let filteredIssues = bookIssues.filter(issue =>
    issue.borrowerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.bookIsbn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterStatus !== 'All') {
    filteredIssues = filteredIssues.filter(i => i.status === filterStatus);
  }

  if (filterBorrower !== 'All') {
    filteredIssues = filteredIssues.filter(i => i.borrowerType === filterBorrower);
  }

  // Get available books
  const availableBooks = books.filter(b => (b.availableCopies || 0) > 0 && b.status === 'Available');

  // Get borrowers based on type
  const availableBorrowers = formData.borrowerType === 'Student' ? students : teachers;

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Issue Books</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/library">Library</Link></li>
              <li className="breadcrumb-item active">Issue Books</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Issue Book</h5>
                  <form>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Borrower Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="borrowerType"
                          value={formData.borrowerType}
                          onChange={handleChange}
                        >
                          <option value="Student">Student</option>
                          <option value="Teacher">Teacher</option>
                        </select>
                      </div>
                      <div className="col-md-8">
                        <label className="form-label">
                          {formData.borrowerType} <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.borrowerId ? 'is-invalid' : ''}`}
                          name="borrowerId"
                          value={formData.borrowerId}
                          onChange={handleChange}
                        >
                          <option value="">Select {formData.borrowerType}</option>
                          {availableBorrowers.map(borrower => (
                            <option key={borrower.id} value={borrower.id}>
                              {formData.borrowerType === 'Student' 
                                ? `${borrower.admissionNo} - ${borrower.firstName} ${borrower.lastName} (${borrower.class})`
                                : `${borrower.employeeId || borrower.id} - ${borrower.firstName} ${borrower.lastName}`
                              }
                            </option>
                          ))}
                        </select>
                        {errors.borrowerId && <div className="invalid-feedback">{errors.borrowerId}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Book <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.bookId ? 'is-invalid' : ''}`}
                          name="bookId"
                          value={formData.bookId}
                          onChange={handleChange}
                        >
                          <option value="">Select Book</option>
                          {availableBooks.map(book => (
                            <option key={book.id} value={book.id}>
                              {book.title} by {book.author} {book.isbn ? `(ISBN: ${book.isbn})` : ''} - Available: {book.availableCopies}
                            </option>
                          ))}
                        </select>
                        {errors.bookId && <div className="invalid-feedback">{errors.bookId}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Issue Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className={`form-control ${errors.issueDate ? 'is-invalid' : ''}`}
                          name="issueDate"
                          value={formData.issueDate}
                          onChange={handleChange}
                          max={new Date().toISOString().split('T')[0]}
                        />
                        {errors.issueDate && <div className="invalid-feedback">{errors.issueDate}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Due Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
                          name="dueDate"
                          value={formData.dueDate}
                          onChange={handleChange}
                          min={formData.issueDate}
                        />
                        {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Remarks</label>
                        <textarea
                          className="form-control"
                          name="remarks"
                          value={formData.remarks}
                          onChange={handleChange}
                          rows="2"
                          placeholder="Additional remarks"
                        />
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleIssue}
                      >
                        <i className="bi bi-book"></i> Issue Book
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Issued Books</h5>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by borrower, book title..."
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
                        <option value="Issued">Issued</option>
                        <option value="Returned">Returned</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-select"
                        value={filterBorrower}
                        onChange={(e) => setFilterBorrower(e.target.value)}
                      >
                        <option value="All">All Borrowers</option>
                        <option value="Student">Students</option>
                        <option value="Teacher">Teachers</option>
                      </select>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Borrower</th>
                          <th>Book Title</th>
                          <th>ISBN</th>
                          <th>Issue Date</th>
                          <th>Due Date</th>
                          <th>Return Date</th>
                          <th>Days Overdue</th>
                          <th>Fine (₹)</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredIssues.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="text-center text-muted">
                              No issued books found
                            </td>
                          </tr>
                        ) : (
                          filteredIssues.map((issue) => {
                            const today = new Date();
                            const dueDate = new Date(issue.dueDate);
                            const daysOverdue = issue.status === 'Issued' && dueDate < today
                              ? Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
                              : 0;
                            const isOverdue = daysOverdue > 0 && issue.status === 'Issued';
                            
                            return (
                              <tr key={issue.id}>
                                <td>
                                  <strong>{issue.borrowerName}</strong><br />
                                  <small className="text-muted">{issue.borrowerNumber}</small>
                                </td>
                                <td>{issue.bookTitle}</td>
                                <td>{issue.bookIsbn || '-'}</td>
                                <td>{issue.issueDate ? new Date(issue.issueDate).toLocaleDateString() : '-'}</td>
                                <td className={isOverdue ? 'text-danger' : ''}>
                                  {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : '-'}
                                </td>
                                <td>{issue.returnDate ? new Date(issue.returnDate).toLocaleDateString() : '-'}</td>
                                <td>
                                  {isOverdue ? (
                                    <span className="badge bg-danger">{daysOverdue} days</span>
                                  ) : (
                                    '-'
                                  )}
                                </td>
                                <td>₹{issue.fineAmount || 0}</td>
                                <td>
                                  <span className={`badge ${
                                    issue.status === 'Returned' ? 'bg-success' :
                                    isOverdue ? 'bg-danger' :
                                    'bg-warning'
                                  }`}>
                                    {isOverdue ? 'Overdue' : issue.status}
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

export default IssueBooks;

