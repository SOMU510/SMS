import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const Books = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { 
    books,
    bookCategories,
    addBook,
    updateBook,
    deleteBook
  } = useSchool();
  
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    categoryId: '',
    categoryName: '',
    edition: '',
    language: 'English',
    totalCopies: 1,
    availableCopies: 1,
    price: '',
    purchaseDate: '',
    shelfNumber: '',
    rowNumber: '',
    status: 'Available', // Available, Lost, Damaged, Under Maintenance
    description: '',
    tags: ''
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Load book data if editing
  useEffect(() => {
    if (isEditMode) {
      const book = books.find(b => b.id === parseInt(id));
      if (book) {
        setFormData({
          isbn: book.isbn || '',
          title: book.title || '',
          author: book.author || '',
          publisher: book.publisher || '',
          categoryId: book.categoryId || '',
          categoryName: book.categoryName || '',
          edition: book.edition || '',
          language: book.language || 'English',
          totalCopies: book.totalCopies || 1,
          availableCopies: book.availableCopies || 1,
          price: book.price || '',
          purchaseDate: book.purchaseDate || '',
          shelfNumber: book.shelfNumber || '',
          rowNumber: book.rowNumber || '',
          status: book.status || 'Available',
          description: book.description || '',
          tags: book.tags || ''
        });
      }
    }
  }, [id, isEditMode, books]);

  // Update available copies when total copies change
  useEffect(() => {
    if (!isEditMode && formData.totalCopies) {
      setFormData(prev => ({
        ...prev,
        availableCopies: parseInt(prev.totalCopies)
      }));
    }
  }, [formData.totalCopies, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };
      
      // Update category name when category ID changes
      if (name === 'categoryId') {
        const category = bookCategories.find(c => c.id === parseInt(value));
        updated.categoryName = category?.name || '';
      }
      
      return updated;
    });
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    if (!formData.totalCopies || parseInt(formData.totalCopies) <= 0) {
      newErrors.totalCopies = 'Valid total copies is required';
    }
    
    if (parseInt(formData.availableCopies) > parseInt(formData.totalCopies)) {
      newErrors.availableCopies = 'Available copies cannot exceed total copies';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const bookData = {
        ...formData,
        totalCopies: parseInt(formData.totalCopies),
        availableCopies: parseInt(formData.availableCopies),
        price: formData.price ? parseFloat(formData.price) : null
      };

      if (isEditMode) {
        updateBook(parseInt(id), bookData);
        alert('Book updated successfully!');
      } else {
        // Check for duplicate ISBN
        if (formData.isbn) {
          const existing = books.find(b => b.isbn.toLowerCase() === formData.isbn.toLowerCase());
          if (existing) {
            alert('Book with this ISBN already exists!');
            return;
          }
        }
        addBook(bookData);
        alert('Book added successfully!');
      }
      navigate('/library/books');
    }
  };

  const handleDelete = (bookId, title) => {
    if (window.confirm(`Are you sure you want to delete book "${title}"?`)) {
      deleteBook(bookId);
    }
  };

  // Filter books
  let filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterCategory !== 'All') {
    filteredBooks = filteredBooks.filter(b => b.categoryId === parseInt(filterCategory));
  }

  if (filterStatus !== 'All') {
    filteredBooks = filteredBooks.filter(b => b.status === filterStatus);
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Available': return 'bg-success';
      case 'Lost': return 'bg-danger';
      case 'Damaged': return 'bg-warning';
      case 'Under Maintenance': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  // If not in add/edit mode, show list view
  if (!showForm) {
    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Books</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/library">Library</Link></li>
                <li className="breadcrumb-item active">Books</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Books</h5>
                      <Link to="/library/books/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Add Book
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by title, author, ISBN..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-select"
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value)}
                        >
                          <option value="All">All Categories</option>
                          {bookCategories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <select
                          className="form-select"
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                        >
                          <option value="All">All Status</option>
                          <option value="Available">Available</option>
                          <option value="Lost">Lost</option>
                          <option value="Damaged">Damaged</option>
                          <option value="Under Maintenance">Under Maintenance</option>
                        </select>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>ISBN</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>Total Copies</th>
                            <th>Available</th>
                            <th>Issued</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredBooks.length === 0 ? (
                            <tr>
                              <td colSpan="9" className="text-center">
                                <p className="text-muted">No books found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredBooks.map((book) => {
                              const issuedCopies = (book.totalCopies || 0) - (book.availableCopies || 0);
                              return (
                                <tr key={book.id}>
                                  <td>{book.isbn || '-'}</td>
                                  <td><strong>{book.title}</strong></td>
                                  <td>{book.author}</td>
                                  <td>{book.categoryName || '-'}</td>
                                  <td>{book.totalCopies || 0}</td>
                                  <td className="text-success">{book.availableCopies || 0}</td>
                                  <td className="text-warning">{issuedCopies}</td>
                                  <td>
                                    <span className={`badge ${getStatusBadge(book.status)}`}>
                                      {book.status}
                                    </span>
                                  </td>
                                  <td>
                                    <Link
                                      to={`/library/books/${book.id}`}
                                      className="btn btn-sm btn-primary me-1"
                                      title="Edit"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </Link>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleDelete(book.id, book.title)}
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
          <h1>{isEditMode ? 'Edit Book' : 'Add Book'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/library/books">Books</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Add'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Book Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Title <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Enter book title"
                        />
                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Author <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.author ? 'is-invalid' : ''}`}
                          name="author"
                          value={formData.author}
                          onChange={handleChange}
                          placeholder="Enter author name"
                        />
                        {errors.author && <div className="invalid-feedback">{errors.author}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">ISBN</label>
                        <input
                          type="text"
                          className="form-control"
                          name="isbn"
                          value={formData.isbn}
                          onChange={handleChange}
                          placeholder="Enter ISBN number"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Category <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleChange}
                        >
                          <option value="">Select Category</option>
                          {bookCategories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                        </select>
                        {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Publisher</label>
                        <input
                          type="text"
                          className="form-control"
                          name="publisher"
                          value={formData.publisher}
                          onChange={handleChange}
                          placeholder="Enter publisher name"
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-3">
                        <label className="form-label">Edition</label>
                        <input
                          type="text"
                          className="form-control"
                          name="edition"
                          value={formData.edition}
                          onChange={handleChange}
                          placeholder="e.g., 1st, 2nd"
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Language</label>
                        <select
                          className="form-select"
                          name="language"
                          value={formData.language}
                          onChange={handleChange}
                        >
                          <option value="English">English</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">
                          Total Copies <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className={`form-control ${errors.totalCopies ? 'is-invalid' : ''}`}
                          name="totalCopies"
                          value={formData.totalCopies}
                          onChange={handleChange}
                          min="1"
                        />
                        {errors.totalCopies && <div className="invalid-feedback">{errors.totalCopies}</div>}
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">
                          Available Copies <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className={`form-control ${errors.availableCopies ? 'is-invalid' : ''}`}
                          name="availableCopies"
                          value={formData.availableCopies}
                          onChange={handleChange}
                          min="0"
                          max={formData.totalCopies}
                        />
                        {errors.availableCopies && <div className="invalid-feedback">{errors.availableCopies}</div>}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-3">
                        <label className="form-label">Price (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Purchase Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="purchaseDate"
                          value={formData.purchaseDate}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Shelf Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="shelfNumber"
                          value={formData.shelfNumber}
                          onChange={handleChange}
                          placeholder="e.g., A-1"
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Row Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="rowNumber"
                          value={formData.rowNumber}
                          onChange={handleChange}
                          placeholder="e.g., R-1"
                        />
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
                          <option value="Available">Available</option>
                          <option value="Lost">Lost</option>
                          <option value="Damaged">Damaged</option>
                          <option value="Under Maintenance">Under Maintenance</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Tags</label>
                        <input
                          type="text"
                          className="form-control"
                          name="tags"
                          value={formData.tags}
                          onChange={handleChange}
                          placeholder="Comma-separated tags"
                        />
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
                          rows="4"
                          placeholder="Book description"
                        />
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate('/library/books')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Add'} Book
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

export default Books;

