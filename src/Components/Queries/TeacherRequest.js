import React, { useState, useEffect } from "react";

const backendUrl = "http://localhost:4500";

const TeacherRequest = () => {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
  const [teacherInputs, setTeacherInputs] = useState({});

  // New states for filtering by priority and domain (complaint type)
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterDomain, setFilterDomain] = useState("All");

  const fetchPendingComplaints = async () => {
    try {
      const res = await fetch(`${backendUrl}/complaints/pending`);
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      setError("Failed to fetch pending complaints: " + err.message);
    }
  };

  const handleInputChange = (id, value) => {
    setTeacherInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleMarkAsResolved = async (complaintId) => {
    const teacherStatement = teacherInputs[complaintId] || "";
    try {
      const res = await fetch(`${backendUrl}/complaints/${complaintId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherStatement,
          status: "Resolved"
        })
      });
      if (!res.ok) throw new Error("Update failed");
      await fetchPendingComplaints();
      setTeacherInputs((prev) => ({ ...prev, [complaintId]: "" }));
    } catch (err) {
      setError("Failed to update complaint: " + err.message);
    }
  };

  useEffect(() => {
    fetchPendingComplaints();
    const interval = setInterval(fetchPendingComplaints, 2000);
    return () => clearInterval(interval);
  }, []);

  // Filter complaints based on selected priority and domain
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesPriority =
      filterPriority === "All" || complaint.priority === filterPriority;
    const matchesDomain =
      filterDomain === "All" || complaint.domain === filterDomain;
    return matchesPriority && matchesDomain;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 py-6 shadow-lg mb-8">
        <h1 className="text-4xl font-bold text-center">
          Teacher Request Dashboard
        </h1>
      </header>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div>
          <label className="mr-2">Filter by Priority:</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
          >
            <option value="All">All</option>
            <option value="High">High Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
        <div>
          <label className="mr-2">Filter by Domain:</label>
          <select
            value={filterDomain}
            onChange={(e) => setFilterDomain(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
          >
            <option value="All">All</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Administrative">Administrative</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Student Affairs">Student Affairs</option>
          </select>
        </div>
      </div>
      {filteredComplaints.length === 0 ? (
        <p>No pending complaints to resolve.</p>
      ) : (
        <div className="grid gap-6">
          {filteredComplaints.map((complaint) => (
            <div key={complaint._id} className="p-6 bg-gray-800 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">{complaint.text}</h3>
              <p className="text-sm text-gray-400">Domain: {complaint.domain}</p>
              <p className="text-sm text-gray-400">Priority: {complaint.priority}</p>
              <p className="text-sm text-gray-400 mb-2">
                Tracking ID: {complaint.trackingId}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Enter teacher statement..."
                  value={teacherInputs[complaint._id] || ""}
                  onChange={(e) => handleInputChange(complaint._id, e.target.value)}
                  className="p-2 rounded bg-gray-700 flex-1"
                />
                <button
                  onClick={() => handleMarkAsResolved(complaint._id)}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
                >
                  Mark as Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherRequest;
