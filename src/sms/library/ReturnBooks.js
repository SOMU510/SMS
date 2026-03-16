import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const ReturnBooks = () => {
  const { 
    bookIssues,
    books,
    updateBookIssue,
    updateBook
  } = useSchool();

  const [selectedIssueId, setSelectedIssueId] = useState('');
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [fineAmount, setFineAmount] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Issued');

  // Get issued books (not returned)
  const issuedBooks = bookIssues.filter(issue => issue.status === 'Issued' || issue.status === 'Overdue');

  // Filter issued books
  let filteredIssues = issuedBooks.filter(issue =>
    issue.borrowerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.bookIsbn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterStatus !== 'All') {
    filteredIssues = filteredIssues.filter(i => {
      const today = new Date();
      const dueDate = new Date(i.dueDate);
      const isOverdue = dueDate < today;
      return filterStatus === 'Overdue' ? isOverdue : !isOverdue;
    });
  }

  // Calculate fine when issue is selected
  React.useEffect(() => {
    if (selectedIssueId) {
      const issue = bookIssues.find(i => i.id === parseInt(selectedIssueId));
      if (issue) {
        const dueDate = new Date(issue.dueDate);
        const retDate = new Date(returnDate);
        const daysOverdue = Math.max(0, Math.floor((retDate - dueDate) / (1000 * 60 * 60 * 24)));
        const calculatedFine = daysOverdue > 0 ? daysOverdue * 5 : 0; // ₹5 per day
        setFineAmount(calculatedFine);
      }
    }
  }, [selectedIssueId, returnDate, bookIssues]);

  const handleReturn = () => {
    if (!selectedIssueId) {
      alert('Please select a book issue');
      return;
    }

    const issue = bookIssues.find(i => i.id === parseInt(selectedIssueId));
    if (!issue) {
      alert('Issue not found');
      return;
    }

    if (window.confirm(`Return book "${issue.bookTitle}"?`)) {
      const updatedIssue = {
        ...issue,
        returnDate: returnDate,
        fineAmount: fineAmount,
        status: 'Returned',
        remarks: remarks
      };

      updateBookIssue(parseInt(selectedIssueId), updatedIssue);

      // Update book available copies
      const book = books.find(b => b.id === issue.bookId);
      if (book) {
        const updatedBook = {
          ...book,
          availableCopies: (book.availableCopies || 0) + 1
        };
        updateBook(issue.bookId, updatedBook);
      }

      alert('Book returned successfully!');
      
      // Reset form
      setSelectedIssueId('');
      setReturnDate(new Date().toISOString().split('T')[0]);
      setFineAmount(0);
      setRemarks('');
    }
  };

  const selectedIssue = selectedIssueId 
    ? bookIssues.find(i => i.id === parseInt(selectedIssueId))
    : null;

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Return Books</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/library">Library</Link></li>
              <li className="breadcrumb-item active">Return Books</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Return Book</h5>
                  <form>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Select Issued Book <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={selectedIssueId}
                          onChange={(e) => setSelectedIssueId(e.target.value)}
                        >
                          <option value="">Select Book Issue</option>
                          {filteredIssues.map(issue => {
                            const today = new Date();
                            const dueDate = new Date(issue.dueDate);
                            const daysOverdue = Math.max(0, Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)));
                            const isOverdue = daysOverdue > 0;
                            
                            return (
                              <option key={issue.id} value={issue.id}>
                                {issue.bookTitle} - {issue.borrowerName} 
                                {isOverdue && ` (${daysOverdue} days overdue)`}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">
                          Return Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Fine Amount (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={fineAmount}
                          onChange={(e) => setFineAmount(parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    {selectedIssue && (
                      <div className="alert alert-info">
                        <strong>Book:</strong> {selectedIssue.bookTitle}<br />
                        <strong>Borrower:</strong> {selectedIssue.borrowerName} ({selectedIssue.borrowerNumber})<br />
                        <strong>Issue Date:</strong> {selectedIssue.issueDate ? new Date(selectedIssue.issueDate).toLocaleDateString() : '-'}<br />
                        <strong>Due Date:</strong> {selectedIssue.dueDate ? new Date(selectedIssue.dueDate).toLocaleDateString() : '-'}
                      </div>
                    )}

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Remarks</label>
                        <textarea
                          className="form-control"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          rows="2"
                          placeholder="Return remarks"
                        />
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleReturn}
                        disabled={!selectedIssueId}
                      >
                        <i className="bi bi-arrow-return-left"></i> Return Book
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
                  <h5 className="card-title">Issued Books (Pending Return)</h5>
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
                        <option value="All">All</option>
                        <option value="Issued">Issued</option>
                        <option value="Overdue">Overdue</option>
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
                          <th>Days Overdue</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredIssues.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center text-muted">
                              No issued books found
                            </td>
                          </tr>
                        ) : (
                          filteredIssues.map((issue) => {
                            const today = new Date();
                            const dueDate = new Date(issue.dueDate);
                            const daysOverdue = Math.max(0, Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)));
                            const isOverdue = daysOverdue > 0;
                            
                            return (
                              <tr key={issue.id} className={isOverdue ? 'table-danger' : ''}>
                                <td>
                                  <strong>{issue.borrowerName}</strong><br />
                                  <small className="text-muted">{issue.borrowerNumber}</small>
                                </td>
                                <td>{issue.bookTitle}</td>
                                <td>{issue.bookIsbn || '-'}</td>
                                <td>{issue.issueDate ? new Date(issue.issueDate).toLocaleDateString() : '-'}</td>
                                <td className={isOverdue ? 'text-danger fw-bold' : ''}>
                                  {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : '-'}
                                </td>
                                <td>
                                  {isOverdue ? (
                                    <span className="badge bg-danger">{daysOverdue} days</span>
                                  ) : (
                                    <span className="text-success">On Time</span>
                                  )}
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => {
                                      setSelectedIssueId(issue.id);
                                      const calculatedFine = daysOverdue > 0 ? daysOverdue * 5 : 0;
                                      setFineAmount(calculatedFine);
                                    }}
                                  >
                                    <i className="bi bi-check-circle"></i> Select to Return
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
};

export default ReturnBooks;

