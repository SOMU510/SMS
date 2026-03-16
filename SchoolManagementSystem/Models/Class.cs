namespace SchoolManagementSystem.Models
{
    public class Class
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public string Sections { get; set; } = string.Empty;
    }
}

