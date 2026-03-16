# School Management System - .NET MVC C# with ADO.NET

A comprehensive school management system built with ASP.NET Core MVC, C#, and ADO.NET for data access.

## Features

- **Student Management**: Add, edit, delete, and view students
- **Teacher Management**: Manage teacher information
- **Staff Management**: Handle staff records
- **Class & Section Management**: Organize classes and sections
- **Subject Management**: Manage subjects and curriculum
- **Academic Year Management**: Handle academic years
- **Attendance Tracking**: Student and staff attendance
- **Leave Management**: Staff leave requests
- **Payroll Management**: Salary and payroll processing
- **Performance Evaluation**: Teacher and staff performance reviews
- **Subject Allocation**: Allocate subjects to teachers

## Prerequisites

- .NET 8.0 SDK or later
- SQL Server (2019 or later) or SQL Server Express
- Visual Studio 2022 or Visual Studio Code

## Installation

1. **Clone or download the project**

2. **Create the Database**
   - Open SQL Server Management Studio (SSMS)
   - Execute the SQL script from `Database/Schema.sql` to create the database and tables

3. **Update Connection String**
   - Open `appsettings.json`
   - Update the `DefaultConnection` string with your SQL Server details:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=YOUR_SERVER;Database=SchoolManagementDB;Integrated Security=True;TrustServerCertificate=True;"
   }
   ```

4. **Restore NuGet Packages**
   ```bash
   dotnet restore
   ```

5. **Run the Application**
   ```bash
   dotnet run
   ```

   Or use Visual Studio:
   - Press F5 to run with debugging
   - Press Ctrl+F5 to run without debugging

6. **Access the Application**
   - Open your browser and navigate to `https://localhost:5001` or `http://localhost:5000`

## Project Structure

```
SchoolManagementSystem/
├── Controllers/          # MVC Controllers
├── Models/              # Data Models
├── Views/               # Razor Views
├── Data/                # Data Access Layer (ADO.NET)
│   ├── DatabaseConnection.cs
│   └── Repositories/
├── Database/            # SQL Scripts
│   └── Schema.sql
├── wwwroot/             # Static Files (CSS, JS, Images)
├── Program.cs           # Application Entry Point
└── appsettings.json     # Configuration
```

## Database Schema

The database includes the following main tables:

- **Students**: Student information
- **Teachers**: Teacher records
- **Staff**: Staff members
- **Classes**: Class information
- **Subjects**: Subject details
- **AcademicYears**: Academic year management
- **Sections**: Section information
- **Attendance**: Student attendance
- **StaffAttendance**: Staff attendance
- **LeaveRequests**: Leave management
- **Payrolls**: Payroll records
- **PerformanceEvaluations**: Performance reviews
- **TeacherSubjectAllocations**: Subject allocations

## Key Technologies

- **ASP.NET Core MVC 8.0**: Web framework
- **C#**: Programming language
- **ADO.NET**: Data access technology
- **SQL Server**: Database
- **Bootstrap 5**: UI framework
- **Bootstrap Icons**: Icon library

## Development Notes

### Adding New Features

1. **Create Model**: Add model class in `Models/` folder
2. **Create Repository**: Add repository class in `Data/` folder
3. **Create Controller**: Add controller in `Controllers/` folder
4. **Create Views**: Add views in `Views/` folder
5. **Update Database**: Add table schema in `Database/Schema.sql`

### Data Access Pattern

The project uses ADO.NET with a repository pattern:

```csharp
// Example: StudentRepository
public class StudentRepository
{
    private readonly DatabaseConnection _db;
    
    public async Task<List<Student>> GetAllAsync()
    {
        // ADO.NET implementation
    }
}
```

## License

This project is created for educational purposes.

## Support

For issues or questions, please contact the development team.

