import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const LibraryReports = () => {
  const { 
    books,
    bookCategories,
    bookIssues,
    students,
    teachers
  } = useSchool();

  const [reportType, setReportType] = useState('summary');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Summary Report
  const getSummaryReport = () => {
    const totalBooks = books.length;
    const totalCopies = books.reduce((sum, b) => sum + (b.totalCopies || 0), 0);
    const availableCopies = books.reduce((sum, b) => sum + (b.availableCopies || 0), 0);
    const issuedCopies = totalCopies - availableCopies;
    const totalIssues = bookIssues.length;
    const activeIssues = bookIssues.filter(i => i.status === 'Issued' || i.status === 'Overdue').length;
    const returnedIssues = bookIssues.filter(i => i.status === 'Returned').length;
    const overdueIssues = bookIssues.filter(i => {
      if (i.status !== 'Issued') return false;
      const dueDate = new Date(i.dueDate);
      return dueDate < new Date();
    }).length;
    const totalFine = bookIssues.reduce((sum, i) => sum + (i.fineAmount || 0), 0);

    return {
      totalBooks,
      totalCopies,
      availableCopies,
      issuedCopies,
      totalIssues,
      activeIssues,
      returnedIssues,
      overdueIssues,
      totalFine
    };
  };

  // Category-wise Report
  const getCategoryReport = () => {
    const categoryStats = {};
    
    books.forEach(book => {
      const category = bookCategories.find(c => c.id === book.categoryId);
      const categoryName = category?.name || 'Uncategorized';
      
      if (!categoryStats[categoryName]) {
        categoryStats[categoryName] = {
          categoryName,
          totalBooks: 0,
          totalCopies: 0,
          availableCopies: 0,
          issuedCopies: 0
        };
      }
      
      categoryStats[categoryName].totalBooks++;
      categoryStats[categoryName].totalCopies += book.totalCopies || 0;
      categoryStats[categoryName].availableCopies += book.availableCopies || 0;
      categoryStats[categoryName].issuedCopies += (book.totalCopies || 0) - (book.availableCopies || 0);
    });

    return Object.values(categoryStats);
  };

  // Popular Books Report
  const getPopularBooksReport = () => {
    const bookStats = {};
    
    bookIssues.forEach(issue => {
      if (!bookStats[issue.bookId]) {
        bookStats[issue.bookId] = {
          bookId: issue.bookId,
          bookTitle: issue.bookTitle,
          issueCount: 0
        };
      }
      bookStats[issue.bookId].issueCount++;
    });

    return Object.values(bookStats)
      .sort((a, b) => b.issueCount - a.issueCount)
      .slice(0, 10);
  };

  // Borrower-wise Report
  const getBorrowerReport = () => {
    const borrowerStats = {};
    
    bookIssues.forEach(issue => {
      const key = `${issue.borrowerType}-${issue.borrowerId}`;
      if (!borrowerStats[key]) {
        borrowerStats[key] = {
          borrowerName: issue.borrowerName,
          borrowerNumber: issue.borrowerNumber,
          borrowerType: issue.borrowerType,
          totalIssues: 0,
          activeIssues: 0,
          returnedIssues: 0,
          totalFine: 0
        };
      }
      
      borrowerStats[key].totalIssues++;
      if (issue.status === 'Issued' || issue.status === 'Overdue') {
        borrowerStats[key].activeIssues++;
      } else if (issue.status === 'Returned') {
        borrowerStats[key].returnedIssues++;
      }
      borrowerStats[key].totalFine += issue.fineAmount || 0;
    });

    return Object.values(borrowerStats);
  };

  // Overdue Books Report
  const getOverdueReport = () => {
    return bookIssues.filter(issue => {
      if (issue.status !== 'Issued') return false;
      const dueDate = new Date(issue.dueDate);
      const isOverdue = dueDate < new Date();
      
      if (startDate && new Date(issue.dueDate) < new Date(startDate)) return false;
      if (endDate && new Date(issue.dueDate) > new Date(endDate)) return false;
      
      return isOverdue;
    }).map(issue => {
      const dueDate = new Date(issue.dueDate);
      const daysOverdue = Math.floor((new Date() - dueDate) / (1000 * 60 * 60 * 24));
      return {
        ...issue,
        daysOverdue
      };
    });
  };

  const summary = getSummaryReport();
  const categoryReport = getCategoryReport();
  const popularBooks = getPopularBooksReport();
  const borrowerReport = getBorrowerReport();
  const overdueReport = getOverdueReport();

  // Filter category report
  let filteredCategoryReport = categoryReport;
  if (selectedCategory !== 'All') {
    filteredCategoryReport = categoryReport.filter(c => c.categoryName === selectedCategory);
  }

  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>Library Reports</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/library">Library</Link></li>
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
                        <option value="category">Category-wise</option>
                        <option value="popular">Popular Books</option>
                        <option value="borrower">Borrower-wise</option>
                        <option value="overdue">Overdue Books</option>
                      </select>
                    </div>
                    {reportType === 'category' && (
                      <div className="col-md-3">
                        <label className="form-label">Filter by Category</label>
                        <select
                          className="form-select"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                          <option value="All">All Categories</option>
                          {bookCategories.map(category => (
                            <option key={category.id} value={category.name}>{category.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    {reportType === 'overdue' && (
                      <>
                        <div className="col-md-3">
                          <label className="form-label">Start Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">End Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>
                      </>
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
                      <h6 className="text-muted mb-1">Total Books</h6>
                      <h4 className="mb-0">{summary.totalBooks}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h6 className="text-muted mb-1">Total Copies</h6>
                      <h4 className="mb-0">{summary.totalCopies}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h6 className="text-muted mb-1">Available</h6>
                      <h4 className="mb-0 text-success">{summary.availableCopies}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body text-center">
                      <h6 className="text-muted mb-1">Issued</h6>
                      <h4 className="mb-0 text-warning">{summary.issuedCopies}</h4>
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
                              <td><strong>Total Books</strong></td>
                              <td>{summary.totalBooks}</td>
                            </tr>
                            <tr>
                              <td><strong>Total Copies</strong></td>
                              <td>{summary.totalCopies}</td>
                            </tr>
                            <tr>
                              <td><strong>Available Copies</strong></td>
                              <td className="text-success">{summary.availableCopies}</td>
                            </tr>
                            <tr>
                              <td><strong>Issued Copies</strong></td>
                              <td className="text-warning">{summary.issuedCopies}</td>
                            </tr>
                            <tr>
                              <td><strong>Total Issues</strong></td>
                              <td>{summary.totalIssues}</td>
                            </tr>
                            <tr>
                              <td><strong>Active Issues</strong></td>
                              <td>{summary.activeIssues}</td>
                            </tr>
                            <tr>
                              <td><strong>Returned Issues</strong></td>
                              <td className="text-success">{summary.returnedIssues}</td>
                            </tr>
                            <tr>
                              <td><strong>Overdue Issues</strong></td>
                              <td className="text-danger">{summary.overdueIssues}</td>
                            </tr>
                            <tr>
                              <td><strong>Total Fine Collected</strong></td>
                              <td>₹{summary.totalFine.toLocaleString()}</td>
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

          {reportType === 'category' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Category-wise Report</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Total Books</th>
                            <th>Total Copies</th>
                            <th>Available</th>
                            <th>Issued</th>
                            <th>Utilization %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCategoryReport.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="text-center text-muted">
                                No data available
                              </td>
                            </tr>
                          ) : (
                            filteredCategoryReport.map((cat, index) => {
                              const utilization = cat.totalCopies > 0 
                                ? ((cat.issuedCopies / cat.totalCopies) * 100).toFixed(1) 
                                : 0;
                              return (
                                <tr key={index}>
                                  <td><strong>{cat.categoryName}</strong></td>
                                  <td>{cat.totalBooks}</td>
                                  <td>{cat.totalCopies}</td>
                                  <td className="text-success">{cat.availableCopies}</td>
                                  <td className="text-warning">{cat.issuedCopies}</td>
                                  <td>
                                    <span className={`badge ${parseFloat(utilization) >= 70 ? 'bg-success' : parseFloat(utilization) >= 40 ? 'bg-warning' : 'bg-info'}`}>
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

          {reportType === 'popular' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Popular Books (Top 10)</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Rank</th>
                            <th>Book Title</th>
                            <th>Total Issues</th>
                          </tr>
                        </thead>
                        <tbody>
                          {popularBooks.length === 0 ? (
                            <tr>
                              <td colSpan="3" className="text-center text-muted">
                                No data available
                              </td>
                            </tr>
                          ) : (
                            popularBooks.map((book, index) => (
                              <tr key={book.bookId}>
                                <td><strong>#{index + 1}</strong></td>
                                <td>{book.bookTitle}</td>
                                <td>
                                  <span className="badge bg-primary">{book.issueCount} times</span>
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
          )}

          {reportType === 'borrower' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Borrower-wise Report</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Borrower</th>
                            <th>Type</th>
                            <th>Total Issues</th>
                            <th>Active</th>
                            <th>Returned</th>
                            <th>Total Fine</th>
                          </tr>
                        </thead>
                        <tbody>
                          {borrowerReport.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="text-center text-muted">
                                No data available
                              </td>
                            </tr>
                          ) : (
                            borrowerReport.map((borrower, index) => (
                              <tr key={index}>
                                <td>
                                  <strong>{borrower.borrowerName}</strong><br />
                                  <small className="text-muted">{borrower.borrowerNumber}</small>
                                </td>
                                <td>
                                  <span className={`badge ${borrower.borrowerType === 'Student' ? 'bg-info' : 'bg-primary'}`}>
                                    {borrower.borrowerType}
                                  </span>
                                </td>
                                <td>{borrower.totalIssues}</td>
                                <td className="text-warning">{borrower.activeIssues}</td>
                                <td className="text-success">{borrower.returnedIssues}</td>
                                <td>₹{borrower.totalFine.toLocaleString()}</td>
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

          {reportType === 'overdue' && (
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Overdue Books Report</h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Borrower</th>
                            <th>Book Title</th>
                            <th>Issue Date</th>
                            <th>Due Date</th>
                            <th>Days Overdue</th>
                            <th>Estimated Fine</th>
                          </tr>
                        </thead>
                        <tbody>
                          {overdueReport.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="text-center text-muted">
                                No overdue books found
                              </td>
                            </tr>
                          ) : (
                            overdueReport.map((issue) => (
                              <tr key={issue.id} className="table-danger">
                                <td>
                                  <strong>{issue.borrowerName}</strong><br />
                                  <small className="text-muted">{issue.borrowerNumber}</small>
                                </td>
                                <td>{issue.bookTitle}</td>
                                <td>{issue.issueDate ? new Date(issue.issueDate).toLocaleDateString() : '-'}</td>
                                <td className="text-danger fw-bold">
                                  {issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : '-'}
                                </td>
                                <td>
                                  <span className="badge bg-danger">{issue.daysOverdue} days</span>
                                </td>
                                <td>₹{(issue.daysOverdue * 5).toLocaleString()}</td>
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

export default LibraryReports;

