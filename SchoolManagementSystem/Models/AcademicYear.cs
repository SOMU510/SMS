namespace SchoolManagementSystem.Models
{
    public class AcademicYear
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "Active";
        public bool IsCurrent { get; set; }
    }
}

