// DepartmentStatistics.js
import React, { useState } from "react";

const DepartmentStatistics = () => {
  const [selectedDept, setSelectedDept] = useState("CSE");

  // Hardcoded data for CS (30 students) and E&TC (20 students)
  const csStudents = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `CS Student ${i + 1}`,
    email: `cs_student${i + 1}@example.com`,
  }));

  const etcStudents = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `E&TC Student ${i + 1}`,
    email: `etc_student${i + 1}@example.com`,
  }));

  const students = selectedDept === "CSE" ? csStudents : etcStudents;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <h2 className="text-2xl font-bold text-slate-200 mb-4">
        Department Statistics
      </h2>
      <div className="mb-6">
        <label htmlFor="deptSelect" className="mr-2 text-slate-200">
          Select Department:
        </label>
        <select
          id="deptSelect"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="p-2 rounded bg-slate-700 text-slate-200"
        >
          <option value="CSE">CS Dept</option>
          <option value="ECE">E&TC Dept</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-slate-200">
          <thead className="text-xs uppercase bg-slate-800 text-slate-300">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b border-slate-700">
                <td className="px-6 py-4">{student.id}</td>
                <td className="px-6 py-4">{student.name}</td>
                <td className="px-6 py-4">{student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentStatistics;
