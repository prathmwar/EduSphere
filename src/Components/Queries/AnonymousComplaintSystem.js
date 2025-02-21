// AnonymousComplaintSystem.js
import React, { useState } from "react";

function AnonymousComplaintSystem() {
  // Sample complaints (some revealed, some anonymous)
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      text: "The cafeteria food quality has decreased significantly.",
      revealed: false,
      identity: null,
    },
    {
      id: 2,
      text: "There is unfair treatment in the grading system.",
      revealed: true,
      identity: "Alice Johnson",
    },
  ]);

  const [newComplaint, setNewComplaint] = useState("");
  const [error, setError] = useState("");

  // Dummy vulgar content check (in a real app, you might use an API or more comprehensive logic)
  function isVulgar(text) {
    const vulgarWords = ["badword1", "badword2"];
    return vulgarWords.some((word) => text.toLowerCase().includes(word));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!newComplaint.trim()) {
      setError("Complaint cannot be empty.");
      return;
    }
    if (isVulgar(newComplaint)) {
      setError("Your complaint contains inappropriate content.");
      return;
    }
    // Add the complaint to the list (simulate submission)
    const newEntry = {
      id: complaints.length + 1,
      text: newComplaint,
      revealed: false, // by default, remains anonymous
      identity: null,
    };
    setComplaints([...complaints, newEntry]);
    setNewComplaint("");
    setError("");
  }

  return (
    <main className="anonymous-complaints p-4 mt-8">
      <h2 className="text-4xl font-bold mb-4">Anonymous Complaint System</h2>
      <p className="mb-4">
        Submit your anonymous complaint below. All complaints are visible to all students.
        Complaints undergo moderation and vulgar content is blocked.
      </p>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newComplaint}
          onChange={(e) => setNewComplaint(e.target.value)}
          placeholder="Type your complaint here..."
          className="w-full p-2 border border-gray-300 rounded"
          rows="4"
        ></textarea>
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Complaint
        </button>
      </form>
      <h3 className="text-2xl font-semibold mb-2">Complaints</h3>
      <ul>
        {complaints.map((complaint) => (
          <li key={complaint.id} className="mb-4 border p-4 rounded">
            <p className="mb-2">{complaint.text}</p>
            <p className="text-sm text-gray-500">
              {complaint.revealed && complaint.identity
                ? `Submitted by: ${complaint.identity}`
                : "Submitted anonymously"}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default AnonymousComplaintSystem;
