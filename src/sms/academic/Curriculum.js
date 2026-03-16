import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

const Curriculum = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { curriculums, classes, subjects, addCurriculum, updateCurriculum, deleteCurriculum } = useSchool();
  const isEditMode = !!id && !isNaN(parseInt(id));
  const isAddMode = location.pathname.includes('/add');
  const showForm = isAddMode || isEditMode;
  
  const [formData, setFormData] = useState({
    name: '',
    className: '',
    subject: '',
    academicYear: '',
    description: '',
    chapters: [],
    status: 'Active'
  });
  const [errors, setErrors] = useState({});
  const [chapterName, setChapterName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Load curriculum data if editing
  useEffect(() => {
    if (isEditMode) {
      const curriculum = curriculums.find(c => c.id === parseInt(id));
      if (curriculum) {
        setFormData({
          name: curriculum.name || '',
          className: curriculum.className || '',
          subject: curriculum.subject || '',
          academicYear: curriculum.academicYear || '',
          description: curriculum.description || '',
          chapters: curriculum.chapters || [],
          status: curriculum.status || 'Active'
        });
      }
    }
  }, [id, isEditMode, curriculums]);

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

  const handleAddChapter = () => {
    if (chapterName.trim()) {
      setFormData(prev => ({
        ...prev,
        chapters: [...prev.chapters, {
          id: Date.now(),
          name: chapterName.trim(),
          topics: []
        }]
      }));
      setChapterName('');
    }
  };

  const handleRemoveChapter = (chapterId) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters.filter(ch => ch.id !== chapterId)
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Curriculum name is required';
    }
    
    if (!formData.className) {
      newErrors.className = 'Class is required';
    }

    if (!formData.subject) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.academicYear) {
      newErrors.academicYear = 'Academic year is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isEditMode) {
        updateCurriculum(parseInt(id), formData);
        alert('Curriculum updated successfully!');
      } else {
        addCurriculum(formData);
        alert('Curriculum added successfully!');
      }
      navigate('/academic/curriculum');
    }
  };

  const handleDelete = (curriculumId, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteCurriculum(curriculumId);
    }
  };

  // Filter curriculums for list view
  const filteredCurriculums = curriculums.filter(curriculum =>
    curriculum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curriculum.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curriculum.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If not in add/edit mode, show list view, otherwise show form
  if (!showForm) {
    return (
      <main id="main" className="main">
        <div className="container-fluid">
          <div className="pagetitle">
            <h1>Curriculum</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item active">Curriculum</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title">All Curriculums</h5>
                      <Link to="/academic/curriculum/add" className="btn btn-primary">
                        <i className="bi bi-plus-circle"></i> Add New Curriculum
                      </Link>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Search curriculums..."
                          value={searchTerm} 
                          onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Curriculum Name</th>
                            <th>Class</th>
                            <th>Subject</th>
                            <th>Academic Year</th>
                            <th>Chapters</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCurriculums.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="text-center">
                                <p className="text-muted">No curriculums found</p>
                              </td>
                            </tr>
                          ) : (
                            filteredCurriculums.map((curriculum) => (
                              <tr key={curriculum.id}>
                                <td>
                                  <strong>{curriculum.name}</strong>
                                  {curriculum.description && (
                                    <>
                                      <br />
                                      <small className="text-muted">{curriculum.description}</small>
                                    </>
                                  )}
                                </td>
                                <td>{curriculum.className || '-'}</td>
                                <td>{curriculum.subject || '-'}</td>
                                <td>{curriculum.academicYear || '-'}</td>
                                <td>{curriculum.chapters?.length || 0}</td>
                                <td>
                                  {curriculum.status === 'Active' ? (
                                    <span className="badge bg-success">Active</span>
                                  ) : (
                                    <span className="badge bg-secondary">Inactive</span>
                                  )}
                                </td>
                                <td>
                                  <Link 
                                    to={`/academic/curriculum/${curriculum.id}`} 
                                    className="btn btn-sm btn-primary me-1"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  <button 
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(curriculum.id, curriculum.name)}
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

  // Form view (for both add and edit)
  return (
    <main id="main" className="main">
      <div className="container-fluid">
        <div className="pagetitle">
          <h1>{isEditMode ? 'Edit Curriculum' : 'Add Curriculum'}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/academic/curriculum">Curriculum</Link></li>
              <li className="breadcrumb-item active">{isEditMode ? 'Edit' : 'Add'}</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Curriculum Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          Curriculum Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g., Mathematics Curriculum 2024"
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                      <div className="col-md-6">
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
                            <option key={cls.id} value={cls.name}>
                              {cls.name}
                            </option>
                          ))}
                        </select>
                        {errors.className && <div className="invalid-feedback">{errors.className}</div>}
                      </div>
                    </div>

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
                          {subjects.map(subj => (
                            <option key={subj.id} value={subj.name}>
                              {subj.name}
                            </option>
                          ))}
                        </select>
                        {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          Academic Year <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.academicYear ? 'is-invalid' : ''}`}
                          name="academicYear"
                          value={formData.academicYear}
                          onChange={handleChange}
                          placeholder="e.g., 2024-2025"
                        />
                        {errors.academicYear && <div className="invalid-feedback">{errors.academicYear}</div>}
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
                          placeholder="Optional description"
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
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    {/* Chapters Section */}
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <h6 className="mb-3">Chapters</h6>
                        <div className="d-flex gap-2 mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter chapter name"
                            value={chapterName}
                            onChange={(e) => setChapterName(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddChapter();
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={handleAddChapter}
                          >
                            <i className="bi bi-plus-circle"></i> Add Chapter
                          </button>
                        </div>

                        {formData.chapters.length > 0 && (
                          <div className="list-group">
                            {formData.chapters.map((chapter) => (
                              <div key={chapter.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>{chapter.name}</span>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleRemoveChapter(chapter.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-end">
                      <button 
                        type="button" 
                        className="btn btn-secondary me-2" 
                        onClick={() => navigate('/academic/curriculum')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save"></i> {isEditMode ? 'Update' : 'Save'} Curriculum
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

export default Curriculum;

