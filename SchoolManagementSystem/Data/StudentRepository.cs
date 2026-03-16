using Microsoft.Data.SqlClient;
using SchoolManagementSystem.Models;
using System.Data;

namespace SchoolManagementSystem.Data
{
    public class StudentRepository
    {
        private readonly DatabaseConnection _db;

        public StudentRepository(DatabaseConnection db)
        {
            _db = db;
        }

        public async Task<List<Student>> GetAllAsync()
        {
            var query = @"
                SELECT Id, AdmissionNo, FirstName, LastName, DateOfBirth, Gender, 
                       Email, Phone, Address, Class, Section, Status, AdmissionDate,
                       ParentName, ParentPhone, ParentEmail
                FROM Students
                ORDER BY AdmissionNo";

            var dataTable = await _db.ExecuteQueryAsync(query);
            var students = new List<Student>();

            foreach (DataRow row in dataTable.Rows)
            {
                students.Add(MapToStudent(row));
            }

            return students;
        }

        public async Task<Student?> GetByIdAsync(int id)
        {
            var query = @"
                SELECT Id, AdmissionNo, FirstName, LastName, DateOfBirth, Gender, 
                       Email, Phone, Address, Class, Section, Status, AdmissionDate,
                       ParentName, ParentPhone, ParentEmail
                FROM Students
                WHERE Id = @Id";

            var parameters = new[]
            {
                new SqlParameter("@Id", id)
            };

            var dataTable = await _db.ExecuteQueryAsync(query, parameters);
            
            if (dataTable.Rows.Count > 0)
            {
                return MapToStudent(dataTable.Rows[0]);
            }

            return null;
        }

        public async Task<int> CreateAsync(Student student)
        {
            var query = @"
                INSERT INTO Students (AdmissionNo, FirstName, LastName, DateOfBirth, Gender, 
                                     Email, Phone, Address, Class, Section, Status, AdmissionDate,
                                     ParentName, ParentPhone, ParentEmail)
                VALUES (@AdmissionNo, @FirstName, @LastName, @DateOfBirth, @Gender, 
                        @Email, @Phone, @Address, @Class, @Section, @Status, @AdmissionDate,
                        @ParentName, @ParentPhone, @ParentEmail);
                SELECT CAST(SCOPE_IDENTITY() as int);";

            var parameters = new[]
            {
                new SqlParameter("@AdmissionNo", student.AdmissionNo),
                new SqlParameter("@FirstName", student.FirstName),
                new SqlParameter("@LastName", student.LastName),
                new SqlParameter("@DateOfBirth", student.DateOfBirth),
                new SqlParameter("@Gender", student.Gender),
                new SqlParameter("@Email", student.Email),
                new SqlParameter("@Phone", student.Phone),
                new SqlParameter("@Address", student.Address),
                new SqlParameter("@Class", student.Class),
                new SqlParameter("@Section", student.Section),
                new SqlParameter("@Status", student.Status),
                new SqlParameter("@AdmissionDate", student.AdmissionDate),
                new SqlParameter("@ParentName", student.ParentName),
                new SqlParameter("@ParentPhone", student.ParentPhone),
                new SqlParameter("@ParentEmail", student.ParentEmail)
            };

            var result = await _db.ExecuteScalarAsync(query, parameters);
            return Convert.ToInt32(result);
        }

        public async Task<bool> UpdateAsync(Student student)
        {
            var query = @"
                UPDATE Students 
                SET AdmissionNo = @AdmissionNo, FirstName = @FirstName, LastName = @LastName,
                    DateOfBirth = @DateOfBirth, Gender = @Gender, Email = @Email,
                    Phone = @Phone, Address = @Address, Class = @Class, Section = @Section,
                    Status = @Status, AdmissionDate = @AdmissionDate,
                    ParentName = @ParentName, ParentPhone = @ParentPhone, ParentEmail = @ParentEmail
                WHERE Id = @Id";

            var parameters = new[]
            {
                new SqlParameter("@Id", student.Id),
                new SqlParameter("@AdmissionNo", student.AdmissionNo),
                new SqlParameter("@FirstName", student.FirstName),
                new SqlParameter("@LastName", student.LastName),
                new SqlParameter("@DateOfBirth", student.DateOfBirth),
                new SqlParameter("@Gender", student.Gender),
                new SqlParameter("@Email", student.Email),
                new SqlParameter("@Phone", student.Phone),
                new SqlParameter("@Address", student.Address),
                new SqlParameter("@Class", student.Class),
                new SqlParameter("@Section", student.Section),
                new SqlParameter("@Status", student.Status),
                new SqlParameter("@AdmissionDate", student.AdmissionDate),
                new SqlParameter("@ParentName", student.ParentName),
                new SqlParameter("@ParentPhone", student.ParentPhone),
                new SqlParameter("@ParentEmail", student.ParentEmail)
            };

            var rowsAffected = await _db.ExecuteNonQueryAsync(query, parameters);
            return rowsAffected > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var query = "DELETE FROM Students WHERE Id = @Id";
            var parameters = new[] { new SqlParameter("@Id", id) };
            var rowsAffected = await _db.ExecuteNonQueryAsync(query, parameters);
            return rowsAffected > 0;
        }

        private Student MapToStudent(DataRow row)
        {
            return new Student
            {
                Id = Convert.ToInt32(row["Id"]),
                AdmissionNo = row["AdmissionNo"].ToString() ?? string.Empty,
                FirstName = row["FirstName"].ToString() ?? string.Empty,
                LastName = row["LastName"].ToString() ?? string.Empty,
                DateOfBirth = Convert.ToDateTime(row["DateOfBirth"]),
                Gender = row["Gender"].ToString() ?? string.Empty,
                Email = row["Email"].ToString() ?? string.Empty,
                Phone = row["Phone"].ToString() ?? string.Empty,
                Address = row["Address"].ToString() ?? string.Empty,
                Class = row["Class"].ToString() ?? string.Empty,
                Section = row["Section"].ToString() ?? string.Empty,
                Status = row["Status"].ToString() ?? "Active",
                AdmissionDate = Convert.ToDateTime(row["AdmissionDate"]),
                ParentName = row["ParentName"].ToString() ?? string.Empty,
                ParentPhone = row["ParentPhone"].ToString() ?? string.Empty,
                ParentEmail = row["ParentEmail"].ToString() ?? string.Empty
            };
        }
    }
}

