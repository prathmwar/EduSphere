import React, { useState, useEffect } from 'react';
import { PlusCircle, FileText, DollarSign, PieChart, BarChart } from 'lucide-react';
import io from 'socket.io-client';
import { Bar } from 'react-chartjs-2';
// import './Messmanagement.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = 'http://localhost:4500/api'; // Note: Use the backend port (5000)
const SOCKET_URL = 'http://localhost:4500';

const BudgetTrackingSystem = () => {
  // State declarations
  const [activeTab, setActiveTab] = useState('dashboard'); // default tab is Dashboard
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [fiscalYear, setFiscalYear] = useState('2024-2025');
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [numStudents, setNumStudents] = useState(0);
const [selectedDate, setSelectedDate] = useState('');


  // Mess management: Boys and Girls sections (for demonstration)
  const [messBudget, setMessBudget] = useState('');
  const [messItems, setMessItems] = useState([
    { name: 'Breakfast', price: '' },
    { name: 'Lunch', price: '' },
    { name: 'Dinner', price: '' },
    { name: 'Snacks', price: '' }
  ]);

  // For adding new budgets and expenses
  const [newBudget, setNewBudget] = useState({
    category: 'event',
    title: '',
    amount: '',
    description: '',
    department: '',
    fiscal_year: fiscalYear
  });
  const [newExpense, setNewExpense] = useState({
    budget_id: '',
    amount: '',
    description: '',
    submitted_by: ''
  });
  const [files, setFiles] = useState([]);

  // For adding new sponsors
  const [newSponsor, setNewSponsor] = useState({
    sponsor_name: '',
    amount: '',
    purpose: '',
    poc_name: '',
    poc_contact: '',
    start_date: '',
    end_date: '',
    contract_details: ''
  });

  // Setup Socket.IO for real-time notifications
  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on('notification', (message) => {
      setNotifications((prev) => [message, ...prev]);
    });
    socket.on('new-budget', (data) => {
      setNotifications((prev) => [`New budget added: ${data.title}`, ...prev]);
      fetchData();
    });
    socket.on('new-expense', (data) => {
      setNotifications((prev) => [`New expense submitted: $${data.amount}`, ...prev]);
      fetchData();
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    fetchData();
    fetchAnalytics();
  }, [fiscalYear]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [budgetRes, expenseRes, sponsorRes] = await Promise.all([
        fetch(`${API_URL}/budgets?fiscal_year=${fiscalYear}`),
        fetch(`${API_URL}/expenses`),
        fetch(`${API_URL}/sponsors`)
      ]);
      const [budgetData, expenseData, sponsorData] = await Promise.all([
        budgetRes.json(),
        expenseRes.json(),
        sponsorRes.json()
      ]);
      setBudgets(budgetData);
      setExpenses(expenseData);
      setSponsors(sponsorData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_URL}/analytics/budget-utilization?fiscal_year=${fiscalYear}`);
      const data = await res.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBudget)
      });
      if (response.ok) {
        fetchData();
        setNewBudget({
          category: 'event',
          title: '',
          amount: '',
          description: '',
          department: '',
          fiscal_year: fiscalYear
        });
      }
    } catch (error) {
      console.error('Error submitting budget:', error);
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newExpense).forEach((key) => formData.append(key, newExpense[key]));
    if (files && files.length > 0) {
      files.forEach((file) => formData.append('proofs', file));
    }
    try {
      const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        fetchData();
        setNewExpense({
          budget_id: '',
          amount: '',
          description: '',
          submitted_by: ''
        });
        setFiles([]);
      }
    } catch (error) {
      console.error('Error submitting expense:', error);
    }
  };

  const handleSponsorSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/sponsors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSponsor)
      });
      if (response.ok) {
        fetchData();
        setNewSponsor({
          sponsor_name: '',
          amount: '',
          purpose: '',
          poc_name: '',
          poc_contact: '',
          start_date: '',
          end_date: '',
          contract_details: ''
        });
      }
    } catch (error) {
      console.error('Error submitting sponsor:', error);
    }
  };

  // Calculate total mess expense and remaining budget
  const totalMessExpense = messItems.reduce((acc, item) => acc + Number(item.price || 0), 0);
  const remainingMessBudget = messBudget ? Number(messBudget) - totalMessExpense : 0;

  // Function to download mess data as CSV
  const downloadMessBudget = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Item,Price\n';
    messItems.forEach(item => {
      csvContent += `${item.name},${item.price}\n`;
    });
    csvContent += `Total Mess Budget,${messBudget}\n`;
    csvContent += `Total Expense,${totalMessExpense}\n`;
    csvContent += `Remaining Budget,${remainingMessBudget}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'mess_budget.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prepare chart data from analyticsData
  const chartData = {
    labels: analyticsData.map((item) => item.title),
    datasets: [
      {
        label: 'Total Allocated',
        data: analyticsData.map((item) => item.amount),
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      },
      {
        label: 'Total Spent',
        data: analyticsData.map((item) => item.total_expense),
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">College Budget Tracking System</h1>
        {/* Real-Time Notification Banner */}
        {notifications.length > 0 && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded shadow">
            {notifications[0]}
          </div>
        )}
        <div className="bg-white rounded-lg shadow mb-6">
          {/* Navigation Tabs */}
          <div className="flex border-b">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart className="inline-block mr-1" size={20} />
              Dashboard
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'budgets' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('budgets')}
            >
              <PieChart className="inline-block mr-1" size={20} />
              Budgets
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'expenses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('expenses')}
            >
              <DollarSign className="inline-block mr-1" size={20} />
              Expenses
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'sponsors' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('sponsors')}
            >
              <FileText className="inline-block mr-1" size={20} />
              Sponsors
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'mess' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('mess')}
            >
              <PieChart className="inline-block mr-1" size={20} />
              Mess Management
            </button>
          </div>
          <div className="p-4">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Budget Utilization Dashboard</h2>
                <div className="mb-4">
                  <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                </div>
                {/* Proofs Section: List recent proof file links from expenses */}
                <h3 className="text-xl font-medium mb-2">Recent Proofs</h3>
                <ul className="list-disc pl-5">
                  {expenses.filter(exp => exp.proof_files && exp.proof_files.length > 0).slice(0, 5).map((exp, idx) => (
                    <li key={idx} className="text-sm">
                      {exp.budget_id.title} -{' '}
                      {exp.proof_files.map((file, i) => (
                        <a
                          key={i}
                          href={`http://localhost:4500/${file.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          View Proof {i + 1}
                        </a>
                      ))}
                    </li>
                  ))}
                </ul>
                {/* Recent Notifications */}
                <h3 className="text-xl font-medium mt-6 mb-2">Recent Notifications</h3>
                <ul className="list-disc pl-5">
                  {notifications.map((note, idx) => (
                    <li key={idx} className="text-sm">{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Budgets Tab */}
            {activeTab === 'budgets' && (
              <div>
                <form onSubmit={handleBudgetSubmit} className="mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={newBudget.category}
                        onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                      >
                        <option value="event">Event</option>
                        <option value="department">Department</option>
                        <option value="mess">Mess</option>
                        <option value="sponsorship">Sponsorship</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={newBudget.title}
                        onChange={(e) => setNewBudget({ ...newBudget, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={newBudget.amount}
                        onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={newBudget.department}
                        onChange={(e) => setNewBudget({ ...newBudget, department: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={newBudget.description}
                      onChange={(e) => setNewBudget({ ...newBudget, description: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
                    <PlusCircle className="inline-block mr-2" size={20} />
                    Add Budget
                  </button>
                </form>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {budgets.map((budget) => (
                        <tr key={budget._id}>
                          <td className="px-4 py-2 whitespace-nowrap">{budget.title}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{budget.category}</td>
                          <td className="px-4 py-2 whitespace-nowrap">${budget.amount}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{budget.department}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                              budget.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : budget.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {budget.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Expenses Tab */}
            {activeTab === 'expenses' && (
              <div>
                <form onSubmit={handleExpenseSubmit} className="mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={newExpense.budget_id}
                        onChange={(e) => setNewExpense({ ...newExpense, budget_id: e.target.value })}
                      >
                        <option value="">Select Budget</option>
                        {budgets.map((budget) => (
                          <option key={budget._id} value={budget._id}>{budget.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Submitted By</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={newExpense.submitted_by}
                      onChange={(e) => setNewExpense({ ...newExpense, submitted_by: e.target.value })}
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proof Files (Optional)</label>
                    <input
                      type="file"
                      multiple
                      className="w-full p-2 border rounded"
                      onChange={(e) => setFiles(Array.from(e.target.files))}
                    />
                  </div>
                  <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
                    <PlusCircle className="inline-block mr-2" size={20} />
                    Add Expense
                  </button>
                </form>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Proofs</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {expenses.map((expense) => (
                        <tr key={expense._id}>
                          <td className="px-4 py-2 whitespace-nowrap">{expense.budget_id.title}</td>
                          <td className="px-4 py-2 whitespace-nowrap">${expense.amount}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{expense.description}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                              expense.status === 'verified'
                                ? 'bg-green-100 text-green-800'
                                : expense.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {expense.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {expense.proof_files.map((file, index) => (
                              <a
                                key={index}
                                href={`http://localhost:4500/${file.path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 block"
                              >
                                View Proof {index + 1}
                              </a>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sponsors Tab */}
            {activeTab === 'sponsors' && (
              <div>
                <form onSubmit={handleSponsorSubmit} className="mb-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sponsor Name</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={newSponsor.sponsor_name}
                        onChange={(e) => setNewSponsor({ ...newSponsor, sponsor_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        value={newSponsor.amount}
                        onChange={(e) => setNewSponsor({ ...newSponsor, amount: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={newSponsor.purpose}
                        onChange={(e) => setNewSponsor({ ...newSponsor, purpose: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">POC Name</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={newSponsor.poc_name}
                        onChange={(e) => setNewSponsor({ ...newSponsor, poc_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">POC Contact</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={newSponsor.poc_contact}
                        onChange={(e) => setNewSponsor({ ...newSponsor, poc_contact: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded"
                        value={newSponsor.start_date}
                        onChange={(e) => setNewSponsor({ ...newSponsor, start_date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded"
                        value={newSponsor.end_date}
                        onChange={(e) => setNewSponsor({ ...newSponsor, end_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contract Details</label>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={newSponsor.contract_details}
                      onChange={(e) => setNewSponsor({ ...newSponsor, contract_details: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
                    <PlusCircle className="inline-block mr-2" size={20} />
                    Add Sponsor
                  </button>
                </form>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sponsor Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sponsors.map((sponsor) => (
                        <tr key={sponsor._id}>
                          <td className="px-4 py-2 whitespace-nowrap">{sponsor.sponsor_name}</td>
                          <td className="px-4 py-2 whitespace-nowrap">${sponsor.amount}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{sponsor.purpose}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                              sponsor.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : sponsor.status === 'terminated'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {sponsor.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Mess Management Tab */}
            {activeTab === 'mess' && (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Mess Management</h2>
    
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Mess Budget</label>
      <input
        type="number"
        className="w-full p-2 border rounded"
        value={messBudget}
        onChange={(e) => setMessBudget(e.target.value)}
      />
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Number of Students</label>
      <input
        type="number"
        className="w-full p-2 border rounded"
        value={numStudents}
        onChange={(e) => setNumStudents(e.target.value)}
      />
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
      <input
        type="date"
        className="w-full p-2 border rounded"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
    </div>

    {messItems.map((item, index) => (
      <div key={index} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{item.name} Price (Per Student)</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={item.price}
          onChange={(e) => {
            const newItems = [...messItems];
            newItems[index].price = e.target.value;
            setMessItems(newItems);
          }}
        />
      </div>
    ))}

    <div className="mb-4">
      <p>Total Expense: ${totalMessExpense * numStudents}</p>
      <p>Remaining Budget: ${messBudget - (totalMessExpense * numStudents)}</p>
    </div>

    <button onClick={downloadMessBudget} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      Download Mess Budget CSV
    </button>
  </div>
)}

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTrackingSystem;
