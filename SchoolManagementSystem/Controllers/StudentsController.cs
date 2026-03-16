using Microsoft.AspNetCore.Mvc;
using SchoolManagementSystem.Data;
using SchoolManagementSystem.Models;

namespace SchoolManagementSystem.Controllers
{
    public class StudentsController : Controller
    {
        private readonly StudentRepository _studentRepository;

        public StudentsController(DatabaseConnection db)
        {
            _studentRepository = new StudentRepository(db);
        }

        // GET: Students
        public async Task<IActionResult> Index(string searchTerm = "")
        {
            var students = await _studentRepository.GetAllAsync();
            
            if (!string.IsNullOrEmpty(searchTerm))
            {
                students = students.Where(s => 
                    s.FirstName.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                    s.LastName.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                    s.AdmissionNo.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                    s.Class.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)
                ).ToList();
            }

            ViewBag.SearchTerm = searchTerm;
            return View(students);
        }

        // GET: Students/Details/5
        public async Task<IActionResult> Details(int id)
        {
            var student = await _studentRepository.GetByIdAsync(id);
            if (student == null)
            {
                return NotFound();
            }
            return View(student);
        }

        // GET: Students/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Students/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Student student)
        {
            if (ModelState.IsValid)
            {
                await _studentRepository.CreateAsync(student);
                TempData["SuccessMessage"] = "Student created successfully!";
                return RedirectToAction(nameof(Index));
            }
            return View(student);
        }

        // GET: Students/Edit/5
        public async Task<IActionResult> Edit(int id)
        {
            var student = await _studentRepository.GetByIdAsync(id);
            if (student == null)
            {
                return NotFound();
            }
            return View(student);
        }

        // POST: Students/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Student student)
        {
            if (id != student.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                var result = await _studentRepository.UpdateAsync(student);
                if (result)
                {
                    TempData["SuccessMessage"] = "Student updated successfully!";
                    return RedirectToAction(nameof(Index));
                }
            }
            return View(student);
        }

        // GET: Students/Delete/5
        public async Task<IActionResult> Delete(int id)
        {
            var student = await _studentRepository.GetByIdAsync(id);
            if (student == null)
            {
                return NotFound();
            }
            return View(student);
        }

        // POST: Students/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var result = await _studentRepository.DeleteAsync(id);
            if (result)
            {
                TempData["SuccessMessage"] = "Student deleted successfully!";
            }
            return RedirectToAction(nameof(Index));
        }
    }
}

