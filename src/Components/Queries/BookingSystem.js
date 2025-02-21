import React, { useState } from 'react';

const InternalStudent = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [option, setOption] = useState("");
  const [companies, setCompanies] = useState([
    { id: 1, name: "Google", industry: "Tech", location: "Mountain View", scheduledDate: "" },
    { id: 2, name: "Microsoft", industry: "Tech", location: "Redmond", scheduledDate: "" },
    { id: 3, name: "Amazon", industry: "E-commerce", location: "Seattle", scheduledDate: "" },
    { id: 4, name: "Facebook", industry: "Social", location: "Menlo Park", scheduledDate: "" }
  ]);
  // Each application now includes a "selected" field (null = pending)
  const [applications, setApplications] = useState([
    { id: 1, company: "Google", status: "", selected: null },
    { id: 2, company: "Microsoft", status: "Under Review", selected: null },
    { id: 3, company: "Amazon", status: "Interview Scheduled", selected: null },
    { id: 4, company: "Facebook", status: "Applied", selected: null }
  ]);
  // Sample student data for TPO view
  const [students, setStudents] = useState([
    { id: 1, name: "Alice Johnson", email: "alice.j@example.com", department: "Computer Science", registrationDate: "2023-01-15" },
    { id: 2, name: "Bob Smith", email: "bob.smith@example.com", department: "Information Technology", registrationDate: "2023-02-20" },
    { id: 3, name: "Carol Williams", email: "carol.w@example.com", department: "Electronics", registrationDate: "2023-03-05" },
    { id: 4, name: "David Brown", email: "david.b@example.com", department: "Mechanical", registrationDate: "2023-03-18" }
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");

  // New states for Quiz feature
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState("");

  // Static metric for placements; you can later adjust this logic to be dynamic.
  const dashboardMetrics = {
    placements: 45
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setOption("");
    // Reset quiz states when switching roles/options
    setQuizSubmitted(false);
    setQuizFeedback("");
  };

  const handleAddCompany = () => {
    const newCompanyName = prompt("Enter company name:");
    if (newCompanyName) {
      const newCompany = {
        id: Date.now(),
        name: newCompanyName,
        industry: "Unknown",
        location: "Unknown",
        scheduledDate: ""
      };
      setCompanies([...companies, newCompany]);
    }
  };

  const handleUpdateCompany = (id) => {
    const newName = prompt("Enter new company name:");
    if (newName) {
      setCompanies(companies.map(comp => comp.id === id ? { ...comp, name: newName } : comp));
    }
  };

  const handleRemoveCompany = (id) => {
    setCompanies(companies.filter(comp => comp.id !== id));
  };

  const handleScheduleDrive = (id) => {
    const newDate = prompt("Enter scheduled date (YYYY-MM-DD):");
    if (newDate) {
      setCompanies(companies.map(comp => comp.id === id ? { ...comp, scheduledDate: newDate } : comp));
    }
  };

  // Student applies to a company. Each new application is created with "selected" set to null.
  const handleApplyCompany = (company) => {
    if (applications.find(app => app.company === company.name)) {
      alert(`You have already applied to ${company.name}.`);
      return;
    }
    const newApplication = {
      id: Date.now(),
      company: company.name,
      status: "Applied",
      selected: null
    };
    setApplications([...applications, newApplication]);
    alert(`Successfully applied to ${company.name}!`);
  };

  // Handle quiz answer submission
  const handleQuizAnswer = (answer) => {
    setQuizSubmitted(true);
    if (answer === "React") {
      setQuizFeedback("Correct! React is indeed the UI library.");
    } else {
      setQuizFeedback("Incorrect. Please try again!");
    }
  };

  // Filter companies using search and filter controls.
  const filteredCompanies = companies.filter(comp => {
    return (
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterIndustry ? comp.industry.toLowerCase() === filterIndustry.toLowerCase() : true) &&
      (filterLocation ? comp.location.toLowerCase() === filterLocation.toLowerCase() : true)
    );
  });

  return (
    <div className="container">
      {/* Inline CSS */}
      <style>{`
        .container {
          background-color: #000;
          color: #fff;
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }
        .navbar {
          background-color: #222;
          padding: 10px;
        }
        .navbar-button {
          background-color: #444;
          color: #fff;
          border: none;
          padding: 10px 20px;
          margin-right: 10px;
          cursor: pointer;
        }
        .navbar-button:hover {
          background-color: #666;
        }
        .main-content {
          padding: 20px;
        }
        .options-buttons button {
          background-color: #007BFF;
          color: white;
          border: none;
          margin: 5px;
          padding: 10px;
          cursor: pointer;
          border-radius: 4px;
        }
        .options-buttons button:hover {
          background-color: #0056b3;
        }
        .search-controls {
          margin: 10px 0;
        }
        .search-controls input, .search-controls select {
          padding: 8px;
          margin-right: 10px;
          border: 1px solid #555;
          border-radius: 4px;
          background-color: #333;
          color: #fff;
        }
        .company-list, .student-list {
          list-style-type: none;
          padding: 0;
        }
        .company-list li, .student-list li {
          padding: 10px;
          border-bottom: 1px solid #444;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .company-list li button, .student-list li button {
          margin-left: 10px;
          background-color: #28a745;
          color: #fff;
          border: none;
          padding: 5px 10px;
          cursor: pointer;
          border-radius: 4px;
        }
        .company-list li button:hover, .student-list li button:hover {
          background-color: #218838;
        }
        .application-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        .application-table th, .application-table td {
          padding: 10px;
          border: 1px solid #555;
          text-align: left;
        }
        .chart-placeholder {
          margin-top: 20px;
          padding: 20px;
          border: 1px dashed #777;
          text-align: center;
        }
        /* Animation CSS */
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .bounce {
          animation: bounce 1s ease-in-out;
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        /* Floating Feedback Button */
        .feedback-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #007BFF;
          color: #fff;
          padding: 10px 15px;
          border-radius: 50px;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }
        .feedback-button:hover {
          background-color: #0056b3;
        }
        /* Info Card in TPO Dashboard */
        .info-card {
          background-color: #333;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 15px;
          border: 1px solid #555;
        }
      `}</style>

      {/* Navbar */}
      <div className="navbar">
        <button className="navbar-button" onClick={() => handleRoleSelect("student")}>
          Student
        </button>
        <button className="navbar-button" onClick={() => handleRoleSelect("tpo")}>
          TPO
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {selectedRole === "student" ? (
          <div className="fade-in">
            <h2>Student Panel</h2>
            <div className="options-buttons">
              <button onClick={() => setOption("viewCompanies")}>View Companies</button>
              <button onClick={() => setOption("applyCompanies")}>Apply for Companies</button>
              <button onClick={() => setOption("trackApplications")}>Track Applications</button>
              <button onClick={() => setOption("seeResults")}>See Results</button>
              <button onClick={() => { setOption("takeQuiz"); setQuizSubmitted(false); setQuizFeedback(""); }}>
                Take Quiz
              </button>
            </div>
            {option === "viewCompanies" && (
              <div className="fade-in">
                <h3>Companies List</h3>
                <div className="search-controls">
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <select
                    value={filterIndustry}
                    onChange={(e) => setFilterIndustry(e.target.value)}
                  >
                    <option value="">All Industries</option>
                    <option value="Tech">Tech</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Social">Social</option>
                  </select>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    <option value="Mountain View">Mountain View</option>
                    <option value="Redmond">Redmond</option>
                    <option value="Seattle">Seattle</option>
                    <option value="Menlo Park">Menlo Park</option>
                  </select>
                </div>
                <ul className="company-list">
                  {filteredCompanies.map(comp => (
                    <li key={comp.id}>
                      <span>
                        {comp.name} - {comp.industry} - {comp.location}
                        {comp.scheduledDate && <span> (Drive on: {comp.scheduledDate})</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {option === "applyCompanies" && (
              <div className="fade-in">
                <h3>Apply for Companies</h3>
                <div className="search-controls">
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <select
                    value={filterIndustry}
                    onChange={(e) => setFilterIndustry(e.target.value)}
                  >
                    <option value="">All Industries</option>
                    <option value="Tech">Tech</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Social">Social</option>
                  </select>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                  >
                    <option value="">All Locations</option>
                    <option value="Mountain View">Mountain View</option>
                    <option value="Redmond">Redmond</option>
                    <option value="Seattle">Seattle</option>
                    <option value="Menlo Park">Menlo Park</option>
                  </select>
                </div>
                <ul className="company-list">
                  {filteredCompanies.map(comp => (
                    <li key={comp.id}>
                      <span>
                        {comp.name} - {comp.industry} - {comp.location}
                        {comp.scheduledDate && <span> (Drive on: {comp.scheduledDate})</span>}
                      </span>
                      {applications.find(app => app.company === comp.name) ? (
                        <button disabled>Applied</button>
                      ) : (
                        <button onClick={() => handleApplyCompany(comp)}>Apply</button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {option === "trackApplications" && (
              <div className="fade-in">
                <h3>Application Tracking</h3>
                <table className="application-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id}>
                        <td>{app.company}</td>
                        <td>{app.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {option === "seeResults" && (
              <div className="fade-in">
                <h3>See Results</h3>
                <table className="application-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Selection</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id}>
                        <td>{app.company}</td>
                        <td>
                          {app.selected === null 
                            ? "Pending" 
                            : app.selected 
                              ? "Selected" 
                              : "Not Selected"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {option === "takeQuiz" && (
              <div className="fade-in bounce">
                <h3>Quiz Time!</h3>
                <p>Which library is used for building user interfaces?</p>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  <li><button onClick={() => handleQuizAnswer("React")}>React</button></li>
                  <li><button onClick={() => handleQuizAnswer("Angular")}>Angular</button></li>
                  <li><button onClick={() => handleQuizAnswer("Vue")}>Vue</button></li>
                  <li><button onClick={() => handleQuizAnswer("Svelte")}>Svelte</button></li>
                </ul>
                {quizSubmitted && <p>{quizFeedback}</p>}
              </div>
            )}
            {option === "" && <p>Please select an option.</p>}
          </div>
        ) : selectedRole === "tpo" ? (
          <div className="fade-in">
            <h2>TPO Panel</h2>
            <div className="options-buttons">
              <button onClick={() => setOption("manageCompanies")}>Manage Companies</button>
              <button onClick={() => setOption("viewStudents")}>View Students</button>
              <button onClick={() => setOption("dashboard")}>Dashboard & Analytics</button>
            </div>
            {option === "manageCompanies" && (
              <div className="fade-in">
                <h3>Manage Companies</h3>
                <button onClick={handleAddCompany}>Add Company</button>
                <ul className="company-list">
                  {companies.map(comp => (
                    <li key={comp.id}>
                      <span>
                        {comp.name} - {comp.industry} - {comp.location}
                        {comp.scheduledDate && <span> (Scheduled: {comp.scheduledDate})</span>}
                      </span>
                      <button onClick={() => handleUpdateCompany(comp.id)}>Update</button>
                      <button onClick={() => handleRemoveCompany(comp.id)}>Remove</button>
                      <button onClick={() => handleScheduleDrive(comp.id)}>Schedule Drive</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {option === "viewStudents" && (
              <div className="fade-in">
                <h3>View Students</h3>
                <div className="search-controls">
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                  />
                </div>
                <table className="application-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Registration Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students
                      .filter(student => student.name.toLowerCase().includes(studentSearchQuery.toLowerCase()))
                      .map(student => (
                        <tr key={student.id}>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>{student.department}</td>
                          <td>{student.registrationDate}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {option === "dashboard" && (
              <div className="fade-in">
                <h3>Dashboard & Analytics</h3>
                <div className="info-card">
                  <p>New Feature: Live analytics and interactive charts coming soon!</p>
                </div>
                <div>
                  <p><strong>Student Registrations:</strong> {students.length}</p>
                  <p><strong>Companies Contacted:</strong> {companies.length}</p>
                  <p><strong>Placements:</strong> {dashboardMetrics.placements}</p>
                  <div className="chart-placeholder">
                    <p>[Chart Placeholder]</p>
                  </div>
                  <div>
                    <h4>Application Analytics</h4>
                    <p><strong>Total Applications:</strong> {applications.length}</p>
                    <p><strong>Selected:</strong> {applications.filter(app => app.selected === true).length}</p>
                    <p><strong>Not Selected:</strong> {applications.filter(app => app.selected === false).length}</p>
                    <p><strong>Pending:</strong> {applications.filter(app => app.selected === null).length}</p>
                  </div>
                  <div>
                    <h4>Recent Student Registrations</h4>
                    <table className="application-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Department</th>
                          <th>Registration Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.slice(-3).map(student => (
                          <tr key={student.id}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.department}</td>
                            <td>{student.registrationDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {option === "" && <p>Please select an option.</p>}
          </div>
        ) : (
          <p>Please select a role from the navbar.</p>
        )}
      </div>

      {/* Floating Feedback Button */}
      <div className="feedback-button fade-in" onClick={() => alert("Thank you for your feedback!")}>
        Feedback
      </div>
    </div>
  );
};

export default InternalStudent;
