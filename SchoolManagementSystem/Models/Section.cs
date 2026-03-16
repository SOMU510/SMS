namespace SchoolManagementSystem.Models
{
    public class Section
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public int CurrentStudents { get; set; }
        public string ClassTeacher { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "Active";
    }
}

