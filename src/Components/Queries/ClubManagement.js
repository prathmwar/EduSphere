import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Home, BookOpen } from 'lucide-react';
const socket = io('http://localhost:4500');
function App() {
  const [globalView, setGlobalView] = useState('booking'); // 'booking' or 'club'
  
  return (
    <div>
      {/* Global Navbar */}
      <nav className="bg-gray-900 text-white p-4">
        <div className="max-w-6xl mx-auto flex space-x-4">
          <button 
             onClick={() => setGlobalView('booking')}
             className={`px-4 py-2 rounded ${globalView === 'booking' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Booking System
          </button>
          <button 
             onClick={() => setGlobalView('club')}
             className={`px-4 py-2 rounded ${globalView === 'club' ? 'bg-blue-600' : 'bg-gray-700'}`}
          >
            Club Management
          </button>
        </div>
      </nav>
      
      {globalView === 'booking' ? <BookingSystem /> : <ClubManagementSystem />}
    </div>
  );
}

// =====================
// Booking System Module
// =====================
const BookingSystem = () => {
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'bookings'
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole] = useState('admin');

  useEffect(() => {
    fetchBookings();

    socket.on('newBooking', (booking) => {
      setBookings(prev => [booking, ...prev]);
    });

    socket.on('bookingUpdated', (updatedBooking) => {
      setBookings(prev =>
        prev.map(booking =>
          booking._id === updatedBooking._id ? updatedBooking : booking
        )
      );
    });

    return () => {
      socket.off('newBooking');
      socket.off('bookingUpdated');
    };
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:4500/bookings');
      const data = await response.json();
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Booking System Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex space-x-8">
              <button
                onClick={() => setView('dashboard')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                  view === 'dashboard' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                }`}
              >
                {/* <Home size={20} /> */}
                {/* <span>Real-Time Dashboard</span> */}
              </button>
              <button
                onClick={() => setView('bookings')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                  view === 'bookings' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                }`}
              >
                <BookOpen size={20} />
                <span>Booking Manager</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Booking Content */}
      <div className="max-w-6xl mx-auto p-8">
        {loading ? (
          <p>Loading bookings...</p>
        ) : (
          view === 'dashboard' ? (
            <Dashboard bookings={bookings} />
          ) : (
            <BookingView 
              bookings={bookings}
              userRole={userRole}
              onBookingUpdate={async (id, status) => {
                try {
                  await fetch(`http://localhost:4500/bookings/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status }),
                  });
                } catch (error) {
                  console.error('Error updating status:', error);
                }
              }}
              onBookingSubmit={async (bookingData) => {
                try {
                  await fetch('http://localhost:4500/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingData),
                  });
                } catch (error) {
                  console.error('Error submitting booking:', error);
                }
              }}
            />
          )
        )}
      </div>
    </div>
  );
};

const Dashboard = ({ bookings }) => {
  const getResourceData = () => {
    const resourceCounts = bookings.reduce((acc, booking) => {
      acc[booking.resource] = (acc[booking.resource] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(resourceCounts).map(([name, value]) => ({ name, value }));
  };

  const getStatusData = () => {
    const statusCounts = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  };

  const getDailyBookings = () => {
    const dailyCounts = bookings.reduce((acc, booking) => {
      acc[booking.date] = (acc[booking.date] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7);
  };

  const recentBookings = [...bookings].slice(0, 5);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

//   return (
//     <div className="space-y-8">
//       <h1 className="text-3xl font-bold text-blue-900">Booking Analytics Dashboard</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Facility Usage Distribution */}
//         {/* <div className="bg-white rounded shadow p-4">
//           <h2 className="text-xl font-bold mb-2">Facility Usage Distribution</h2>
//           <PieChart width={400} height={300}>
//             <Pie
//               data={getResourceData()}
//               cx={200}
//               cy={150}
//               innerRadius={60}
//               outerRadius={100}
//               fill="#8884d8"
//               dataKey="value"
//               label
//             >
//               {getResourceData().map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </div> */}

//         {/* Booking Status Distribution */}
//         {/* <div className="bg-white rounded shadow p-4">
//           <h2 className="text-xl font-bold mb-2">Booking Status Distribution</h2>
//           <BarChart
//             width={400}
//             height={300}
//             data={getStatusData()}
//             margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="value" fill="#8884d8">
//               {getStatusData().map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Bar>
//           </BarChart>
//         </div> */}

//         {/* Daily Booking Trends */}
//         {/* <div className="bg-white rounded shadow p-4 md:col-span-2">
//           <h2 className="text-xl font-bold mb-2">Daily Booking Trends (Last 7 Days)</h2>
//           <LineChart
//             width={800}
//             height={300}
//             data={getDailyBookings()}
//             margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="count" stroke="#8884d8" />
//           </LineChart>
//         </div> */}

//         {/* Recent Bookings Table */}
//         <div className="bg-white rounded shadow p-4 md:col-span-2">
//           <h2 className="text-xl font-bold mb-2">Recent Bookings</h2>
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead>
//               <tr>
//                 <th className="px-4 py-2 text-left">Resource</th>
//                 <th className="px-4 py-2 text-left">Date</th>
//                 <th className="px-4 py-2 text-left">Time</th>
//                 <th className="px-4 py-2 text-left">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {recentBookings.map(booking => (
//                 <tr key={booking._id}>
//                   <td className="px-4 py-2">{booking.resource}</td>
//                   <td className="px-4 py-2">{booking.date}</td>
//                   <td className="px-4 py-2">{booking.time}</td>
//                   <td className="px-4 py-2">{booking.status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
};

const BookingView = ({ bookings, userRole, onBookingUpdate, onBookingSubmit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter(booking => 
    booking.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-blue-900">Booking Manager</h1>
      
      {/* Search Filter */}
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md w-full"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BookingForm onSubmit={onBookingSubmit} />
        <BookingStats bookings={bookings} />
      </div>

      <BookingList 
        bookings={filteredBookings}
        isAdmin={userRole === 'admin'}
        onUpdateStatus={onBookingUpdate}
      />
    </div>
  );
};

const BookingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    resource: '',
    date: '',
    time: '',
    duration: '',
    details: '',
    submittedBy: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(formData.resource && formData.date && formData.time && formData.duration && formData.submittedBy) {
      onSubmit(formData);
      setFormData({
        resource: '',
        date: '',
        time: '',
        duration: '',
        details: '',
        submittedBy: ''
      });
    } else {
      alert('Please fill in all required fields.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">New Booking</h2>
      <div className="mb-2">
        <label className="block">Resource</label>
        <input 
          type="text" 
          name="resource" 
          value={formData.resource} 
          onChange={handleChange}
          placeholder="e.g., Auditorium A"
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block">Date</label>
        <input 
          type="date" 
          name="date" 
          value={formData.date} 
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block">Time</label>
        <input 
          type="time" 
          name="time" 
          value={formData.time} 
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block">Duration (minutes)</label>
        <input 
          type="number" 
          name="duration" 
          value={formData.duration} 
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block">Details</label>
        <textarea 
          name="details" 
          value={formData.details} 
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block">Submitted By</label>
        <input 
          type="text" 
          name="submittedBy" 
          value={formData.submittedBy} 
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Submit Booking
      </button>
    </form>
  );
};

const BookingStats = ({ bookings }) => {
  const total = bookings.length;
  const approved = bookings.filter(b => b.status === 'Approved').length;
  const pending = bookings.filter(b => b.status === 'Pending').length;
  const rejected = bookings.filter(b => b.status === 'Rejected').length;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Booking Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-2 bg-blue-100 rounded">
          <h3 className="font-bold">Total</h3>
          <p>{total}</p>
        </div>
        <div className="p-2 bg-green-100 rounded">
          <h3 className="font-bold">Approved</h3>
          <p>{approved}</p>
        </div>
        <div className="p-2 bg-yellow-100 rounded">
          <h3 className="font-bold">Pending</h3>
          <p>{pending}</p>
        </div>
        <div className="p-2 bg-red-100 rounded">
          <h3 className="font-bold">Rejected</h3>
          <p>{rejected}</p>
        </div>
      </div>
    </div>
  );
};

const BookingList = ({ bookings, isAdmin, onUpdateStatus }) => {
  return (
    <div className="mt-8 bg-white rounded shadow p-4">
      <h2 className="text-xl font-bold mb-4">Booking List</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Resource</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Time</th>
            <th className="px-4 py-2 text-left">Duration</th>
            <th className="px-4 py-2 text-left">Status</th>
            {isAdmin && <th className="px-4 py-2 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {bookings.map(booking => (
            <tr key={booking._id}>
              <td className="px-4 py-2">{booking.resource}</td>
              <td className="px-4 py-2">{booking.date}</td>
              <td className="px-4 py-2">{booking.time}</td>
              <td className="px-4 py-2">{booking.duration} mins</td>
              <td className="px-4 py-2">{booking.status}</td>
              {isAdmin && (
                <td className="px-4 py-2">
                  {booking.status === 'Pending' && (
                    <>
                      <button 
                        onClick={() => onUpdateStatus(booking._id, 'Approved')}
                        className="mr-2 bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(booking._id, 'Rejected')}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================
// Club Management Module
// ============================
function ClubManagementSystem() {
  const [clubView, setClubView] = useState('dashboard'); // 'dashboard', 'budget', 'applications'
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6">
      {/* Club Management Navbar */}
      <nav className="bg-gray-700 p-4 rounded mb-6">
        <div className="flex space-x-4">
          <button 
            onClick={() => setClubView('dashboard')}
            className={`px-4 py-2 rounded ${clubView === 'dashboard' ? 'bg-blue-600' : 'bg-gray-600'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setClubView('budget')}
            className={`px-4 py-2 rounded ${clubView === 'budget' ? 'bg-blue-600' : 'bg-gray-600'}`}
          >
            Budget
          </button>
          <button 
            onClick={() => setClubView('applications')}
            className={`px-4 py-2 rounded ${clubView === 'applications' ? 'bg-blue-600' : 'bg-gray-600'}`}
          >
            Club Details
          </button>
        </div>
      </nav>
      
      {clubView === 'dashboard' && <ClubDashboard />}
      {clubView === 'budget' && <ClubBudget />}
      {clubView === 'applications' && <ClubApplications />}
    </div>
  );
}

function ClubDashboard() {
  const [applications, setApplications] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:4500/applications')
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(err => console.error(err));
  }, []);
  
  const getStatusData = () => {
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  };
  
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Club Dashboard</h2>
      <div className="bg-white text-black p-4 rounded shadow">
        <h3 className="text-xl mb-2">Application Status Distribution</h3>
        <BarChart width={400} height={300} data={getStatusData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
}

function ClubBudget() {
  const backendURL = "http://localhost:4500";
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({ title: '', amount: '', type: '' });
  const [files, setFiles] = useState(null);
  
  useEffect(() => {
    fetchBudgets();
  }, []);
  
  const fetchBudgets = () => {
    fetch(`${backendURL}/api/budgets`)
      .then(res => res.json())
      .then(data => setBudgets(data))
      .catch(err => console.error(err));
  };
  
  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', formData.title);
    form.append('amount', formData.amount);
    form.append('type', formData.type);
    if(files) {
      for (let i = 0; i < files.length; i++) {
        form.append('files', files[i]);
      }
    }
    fetch(`${backendURL}/api/budgets`, {
      method: 'POST',
      body: form
    })
    .then(res => res.json())
    .then(data => {
      fetchBudgets();
      setFormData({ title: '', amount: '', type: '' });
      setFiles(null);
    })
    .catch(err => console.error(err));
  };
  
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Club Budget</h2>
      <form onSubmit={handleBudgetSubmit} className="bg-white text-black p-4 rounded shadow mb-6">
        <div className="mb-4">
          <label>Title</label>
          <input 
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2 border"
            required
          />
        </div>
        <div className="mb-4">
          <label>Amount</label>
          <input 
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            className="w-full p-2 border"
            required
          />
        </div>
        <div className="mb-4">
          <label>Type</label>
          <input 
            type="text"
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full p-2 border"
            required
          />
        </div>
        <div className="mb-4">
          <label>Files</label>
          <input 
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="w-full p-2 border"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit Budget</button>
      </form>
      
      <div className="bg-white text-black p-4 rounded shadow">
        <h3 className="text-xl mb-2">Budget Records</h3>
        {budgets.length === 0 ? <p>No budgets submitted yet.</p> : (
          <ul>
            {budgets.map(budget => (
              <li key={budget._id} className="mb-2">
                <strong>{budget.title}</strong> - ${budget.amount} - {budget.type}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ClubApplications() {
  const backendURL = "http://localhost:4500";
  const [applications, setApplications] = useState([]);
  
  const fetchApplications = () => {
    fetch(`${backendURL}/applications`)
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(err => console.error("Error fetching applications", err));
  };
  
  useEffect(() => {
    fetchApplications();
    const interval = setInterval(() => {
      fetch(`${backendURL}/applications/priority/update`, { method: "PATCH" })
        .then(() => fetchApplications())
        .catch((err) => console.error("Error updating priorities", err));
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const addApplication = (applicationData) => {
    fetch(`${backendURL}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(applicationData),
    })
      .then(() => fetchApplications())
      .catch((err) => console.error("Error adding application", err));
  };
  
  const updateApplicationStatus = (id, status) => {
    fetch(`${backendURL}/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then(() => fetchApplications())
      .catch((err) => console.error("Error updating status", err));
  };
  
  return (
    <div>
      <h2 className="text-4xl font-bold text-center mb-10">Transparent Application &amp; Approval System</h2>
      <ClubManagementForm onSubmit={addApplication} />
      <ClubApplicationList 
        applications={applications} 
        onUpdateStatus={updateApplicationStatus} 
        isAdmin={true} 
      />
    </div>
  );
}

function ClubManagementForm({ onSubmit }) {
  const [type, setType] = useState("Event Organization");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;
    onSubmit({ type, title, description, submittedAt: new Date().toISOString() });
    setTitle("");
    setDescription("");
  };
  
  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md mx-auto mb-8">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold text-gray-100 mb-6">Submit New Application</h2>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Type:</label>
          <select
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Event Organization">Event Organization</option>
            <option value="Budget Approval">Budget Approval</option>
            <option value="Sponsorship">Sponsorship</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 mb-1">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-100 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-gray-100 rounded hover:bg-blue-700 transition transform hover:scale-105"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}

function ClubApplicationList({ applications, onUpdateStatus, isAdmin }) {
  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-100 mb-6">Applications</h2>
      {applications.length === 0 ? (
        <p className="text-gray-300">No applications submitted yet.</p>
      ) : (
        <ul className="divide-y divide-gray-700">
          {applications.map((app) => (
            <li key={app._id} className="py-4">
              <h3 className="text-xl font-semibold text-gray-100">
                {app.title} <span className="text-sm text-gray-400">({app.type})</span>
              </h3>
              <p className="text-gray-300">{app.description}</p>
              <p className="text-gray-400 text-sm mt-1">
                Status: <span className="font-medium">{app.status}</span>
              </p>
              <p className="text-gray-400 text-sm">
                Submitted At: {new Date(app.submittedAt).toLocaleString()}
              </p>
              {isAdmin && app.status === "Pending" && (
                <div className="mt-3 space-x-3">
                  <button
                    onClick={() => onUpdateStatus(app._id, "Approved")}
                    className="px-4 py-2 bg-green-500 text-gray-100 rounded hover:bg-green-600 transition transform hover:scale-105"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onUpdateStatus(app._id, "Rejected")}
                    className="px-4 py-2 bg-red-500 text-gray-100 rounded hover:bg-red-600 transition transform hover:scale-105"
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
