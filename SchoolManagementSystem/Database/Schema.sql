-- School Management System Database Schema
-- SQL Server Database

USE SchoolManagementDB;
GO

-- Students Table
CREATE TABLE Students (
    Id INT PRIMARY KEY IDENTITY(1,1),
    AdmissionNo NVARCHAR(50) UNIQUE NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    DateOfBirth DATE NOT NULL,
    Gender NVARCHAR(10) NOT NULL,
    Email NVARCHAR(100),
    Phone NVARCHAR(20),
    Address NVARCHAR(500),
    Class NVARCHAR(50),
    Section NVARCHAR(50),
    Status NVARCHAR(20) DEFAULT 'Active',
    AdmissionDate DATE NOT NULL,
    ParentName NVARCHAR(200),
    ParentPhone NVARCHAR(20),
    ParentEmail NVARCHAR(100),
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE()
);
GO

-- Teachers Table
CREATE TABLE Teachers (
    Id INT PRIMARY KEY IDENTITY(1,1),
    EmployeeId NVARCHAR(50) UNIQUE NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    DateOfBirth DATE NOT NULL,
    Gender NVARCHAR(10) NOT NULL,
    Email NVARCHAR(100),
    Phone NVARCHAR(20),
    Address NVARCHAR(500),
    Subject NVARCHAR(100),
    Class NVARCHAR(50),
    Qualification NVARCHAR(200),
    Experience NVARCHAR(100),
    Status NVARCHAR(20) DEFAULT 'Active',
    JoiningDate DATE NOT NULL,
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE()
);
GO

-- Staff Table
CREATE TABLE Staff (
    Id INT PRIMARY KEY IDENTITY(1,1),
    EmployeeId NVARCHAR(50) UNIQUE NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    StaffType NVARCHAR(50) NOT NULL,
    Designation NVARCHAR(100),
    Department NVARCHAR(100),
    DateOfBirth DATE NOT NULL,
    Gender NVARCHAR(10) NOT NULL,
    Email NVARCHAR(100),
    Phone NVARCHAR(20),
    Address NVARCHAR(500),
    Qualification NVARCHAR(200),
    Experience NVARCHAR(100),
    Salary DECIMAL(18,2),
    Status NVARCHAR(20) DEFAULT 'Active',
    JoiningDate DATE NOT NULL,
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE()
);
GO

-- Classes Table
CREATE TABLE Classes (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(50) NOT NULL,
    Capacity INT DEFAULT 40,
    Sections NVARCHAR(200),
    CreatedDate DATETIME DEFAULT GETDATE()
);
GO

-- Subjects Table
CREATE TABLE Subjects (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Code NVARCHAR(20),
    Class NVARCHAR(50),
    Teacher NVARCHAR(200),
    CreatedDate DATETIME DEFAULT GETDATE()
);
GO

-- Academic Years Table
CREATE TABLE AcademicYears (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(50) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Description NVARCHAR(500),
    Status NVARCHAR(20) DEFAULT 'Active',
    IsCurrent BIT DEFAULT 0,
    CreatedDate DATETIME DEFAULT GETDATE()
);
GO

-- Sections Table
CREATE TABLE Sections (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(50) NOT NULL,
    ClassName NVARCHAR(50) NOT NULL,
    Capacity INT DEFAULT 40,
    CurrentStudents INT DEFAULT 0,
    ClassTeacher NVARCHAR(200),
    Description NVARCHAR(500),
    Status NVARCHAR(20) DEFAULT 'Active',
    CreatedDate DATETIME DEFAULT GETDATE()
);
GO

-- Attendance Table
CREATE TABLE Attendance (
    Id INT PRIMARY KEY IDENTITY(1,1),
    StudentId INT NOT NULL,
    Date DATE NOT NULL,
    Status NVARCHAR(20) NOT NULL,
    Remarks NVARCHAR(500),
    CreatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (StudentId) REFERENCES Students(Id)
);
GO

-- Staff Attendance Table
CREATE TABLE StaffAttendance (
    Id INT PRIMARY KEY IDENTITY(1,1),
    StaffId INT NOT NULL,
    Date DATE NOT NULL,
    Status NVARCHAR(20) NOT NULL,
    CheckIn TIME,
    CheckOut TIME,
    Notes NVARCHAR(500),
    CreatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (StaffId) REFERENCES Staff(Id)
);
GO

-- Leave Requests Table
CREATE TABLE LeaveRequests (
    Id INT PRIMARY KEY IDENTITY(1,1),
    StaffId INT NOT NULL,
    LeaveType NVARCHAR(50) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Days INT NOT NULL,
    Reason NVARCHAR(1000) NOT NULL,
    AppliedDate DATE NOT NULL,
    Status NVARCHAR(20) DEFAULT 'Pending',
    ApprovedBy NVARCHAR(200),
    Remarks NVARCHAR(500),
    CreatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (StaffId) REFERENCES Staff(Id)
);
GO

-- Payroll Table
CREATE TABLE Payrolls (
    Id INT PRIMARY KEY IDENTITY(1,1),
    StaffId INT NOT NULL,
    Month NVARCHAR(10) NOT NULL,
    Year INT NOT NULL,
    BasicSalary DECIMAL(18,2) NOT NULL,
    HouseRent DECIMAL(18,2) DEFAULT 0,
    Medical DECIMAL(18,2) DEFAULT 0,
    Transport DECIMAL(18,2) DEFAULT 0,
    OtherAllowances DECIMAL(18,2) DEFAULT 0,
    Tax DECIMAL(18,2) DEFAULT 0,
    ProvidentFund DECIMAL(18,2) DEFAULT 0,
    Insurance DECIMAL(18,2) DEFAULT 0,
    Loan DECIMAL(18,2) DEFAULT 0,
    OtherDeductions DECIMAL(18,2) DEFAULT 0,
    Overtime DECIMAL(18,2) DEFAULT 0,
    Bonus DECIMAL(18,2) DEFAULT 0,
    GrossSalary DECIMAL(18,2) NOT NULL,
    TotalDeductions DECIMAL(18,2) DEFAULT 0,
    NetSalary DECIMAL(18,2) NOT NULL,
    PaymentDate DATE,
    PaymentMethod NVARCHAR(50),
    Status NVARCHAR(20) DEFAULT 'Pending',
    Remarks NVARCHAR(500),
    CreatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (StaffId) REFERENCES Staff(Id)
);
GO

-- Performance Evaluations Table
CREATE TABLE PerformanceEvaluations (
    Id INT PRIMARY KEY IDENTITY(1,1),
    StaffId INT NOT NULL,
    EvaluationPeriod NVARCHAR(50) NOT NULL,
    EvaluationDate DATE NOT NULL,
    EvaluatorName NVARCHAR(200) NOT NULL,
    TeachingQuality DECIMAL(3,1) DEFAULT 0,
    SubjectKnowledge DECIMAL(3,1) DEFAULT 0,
    ClassroomManagement DECIMAL(3,1) DEFAULT 0,
    StudentEngagement DECIMAL(3,1) DEFAULT 0,
    LessonPlanning DECIMAL(3,1) DEFAULT 0,
    Communication DECIMAL(3,1) DEFAULT 0,
    Teamwork DECIMAL(3,1) DEFAULT 0,
    Punctuality DECIMAL(3,1) DEFAULT 0,
    Professionalism DECIMAL(3,1) DEFAULT 0,
    ProblemSolving DECIMAL(3,1) DEFAULT 0,
    StudentSatisfaction DECIMAL(3,1) DEFAULT 0,
    ParentFeedback DECIMAL(3,1) DEFAULT 0,
    Attendance DECIMAL(3,1) DEFAULT 0,
    Initiative DECIMAL(3,1) DEFAULT 0,
    OverallRating DECIMAL(3,2) DEFAULT 0,
    Strengths NVARCHAR(1000),
    AreasForImprovement NVARCHAR(1000),
    Recommendations NVARCHAR(1000),
    Status NVARCHAR(20) DEFAULT 'Draft',
    Remarks NVARCHAR(500),
    CreatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (StaffId) REFERENCES Staff(Id)
);
GO

-- Teacher Subject Allocations Table
CREATE TABLE TeacherSubjectAllocations (
    Id INT PRIMARY KEY IDENTITY(1,1),
    AcademicYearId INT NOT NULL,
    TeacherId INT NOT NULL,
    ClassId INT NOT NULL,
    SectionId INT,
    SubjectId INT NOT NULL,
    StartDate DATE,
    EndDate DATE,
    Status NVARCHAR(20) DEFAULT 'Active',
    Remarks NVARCHAR(500),
    CreatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (AcademicYearId) REFERENCES AcademicYears(Id),
    FOREIGN KEY (TeacherId) REFERENCES Teachers(Id),
    FOREIGN KEY (ClassId) REFERENCES Classes(Id),
    FOREIGN KEY (SectionId) REFERENCES Sections(Id),
    FOREIGN KEY (SubjectId) REFERENCES Subjects(Id)
);
GO

-- Create Indexes for better performance
CREATE INDEX IX_Students_AdmissionNo ON Students(AdmissionNo);
CREATE INDEX IX_Students_Class ON Students(Class);
CREATE INDEX IX_Teachers_EmployeeId ON Teachers(EmployeeId);
CREATE INDEX IX_Staff_EmployeeId ON Staff(EmployeeId);
CREATE INDEX IX_Attendance_StudentId_Date ON Attendance(StudentId, Date);
CREATE INDEX IX_StaffAttendance_StaffId_Date ON StaffAttendance(StaffId, Date);
GO

