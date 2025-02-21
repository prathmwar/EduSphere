// combined-backend.js

const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

// --------------------------
// Create Express App & Server
// --------------------------
const app = express();
const server = http.createServer(app);
const PORT = 4500;

// Setup Socket.IO (single instance for all modules)
const io = new Server(server, {
  cors: {
    origin: '*', // adjust as needed; file 4 originally allowed only http://localhost:3000
    methods: ["GET", "POST", "PATCH", "DELETE"]
  }
});

// --------------------------
// Global Middleware
// --------------------------
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --------------------------
// Multer Configurations
// --------------------------

// For file proofs (Finance/Expenses from file 1)
const proofStorage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, 'PROOF-' + Date.now() + path.extname(file.originalname));
  }
});
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images and PDFs Only!');
  }
}
const uploadProof = multer({
  storage: proofStorage,
  limits: { fileSize: 10000000 }, // 10MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// For club budgets (file 3)
const budgetStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const uploadBudget = multer({ storage: budgetStorage });

// --------------------------
// MongoDB Connections (using createConnection for separate databases)
// --------------------------
const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const dbFinance = mongoose.createConnection('mongodb://localhost:27017/databaseq7', dbOptions);
dbFinance.on('error', err => console.error('MongoDB connection error (Finance):', err));
dbFinance.once('open', () => console.log('Connected to MongoDB for Finance'));

const dbComplaints = mongoose.createConnection('mongodb://localhost:27017/indexx2', dbOptions);
dbComplaints.on('error', err => console.error('MongoDB connection error (Complaints):', err));
dbComplaints.once('open', () => console.log('Connected to MongoDB for Complaints'));

const dbClub = mongoose.createConnection('mongodb://localhost:27017/applicationsDB', dbOptions);
dbClub.on('error', err => console.error('MongoDB connection error (Club Management):', err));
dbClub.once('open', () => console.log('Connected to MongoDB for Club Management'));

const dbBookings = mongoose.createConnection('mongodb://localhost:27017/bookingsDB', dbOptions);
dbBookings.on('error', err => console.error('MongoDB connection error (Bookings):', err));
dbBookings.once('open', () => console.log('Connected to MongoDB for Bookings'));

// --------------------------
// Models & Schemas
// --------------------------

// === Finance Module (from file 1) ===

// Finance Budget Schema (renamed from "Budget")
const financeBudgetSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['event', 'department', 'mess', 'sponsorship'],
  },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  description: String,
  department: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  fiscal_year: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: Date,
});
const FinanceBudget = dbFinance.model('FinanceBudget', financeBudgetSchema);

// Expense Schema
const expenseSchema = new mongoose.Schema({
  budget_id: { type: mongoose.Schema.Types.ObjectId, ref: 'FinanceBudget', required: true },
  amount: { type: Number, required: true },
  description: String,
  proof_files: [
    {
      filename: String,
      path: String,
      upload_date: Date,
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
  submitted_by: { type: String, required: true },
  verified_by: String,
  verification_date: Date,
  created_at: { type: Date, default: Date.now },
});
const Expense = dbFinance.model('Expense', expenseSchema);

// Sponsor Schema
const sponsorSchema = new mongoose.Schema({
  sponsor_name: { type: String, required: true },
  amount: { type: Number, required: true },
  purpose: String,
  contract_details: String,
  start_date: Date,
  end_date: Date,
  status: {
    type: String,
    enum: ['active', 'completed', 'terminated'],
    default: 'active',
  },
  poc_name: String,
  poc_contact: String,
  created_at: { type: Date, default: Date.now },
});
const Sponsor = dbFinance.model('Sponsor', sponsorSchema);

// === Complaints Module (from file 2) ===

const complaintSchema = new mongoose.Schema({
  text: { type: String, required: true },
  domain: { type: String, required: true },
  submissionDate: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  studentId: { type: String, required: true },
  assignedTo: { type: String, default: null },
  comments: { type: Array, default: [] },
  priority: { type: String, default: "Medium" },
  isAnonymous: { type: Boolean, default: false },
  teacherStatement: { type: String, default: "" },
  trackingId: { type: String, required: true }
});
const Complaint = dbComplaints.model('Complaint', complaintSchema);

// === Club Management Module (from file 3) ===

// Application Schema
const applicationSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  submittedAt: { type: Number, default: Date.now },
  priority: { type: Number, default: 0 },
});
const Application = dbClub.model('Application', applicationSchema);

// Club Budget Schema (renamed to avoid conflict with FinanceBudget)
const clubBudgetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  files: [{ type: String }],
  submittedAt: { type: Date, default: Date.now },
});
const ClubBudget = dbClub.model('ClubBudget', clubBudgetSchema);

// === Booking Module (from file 4) ===

const bookingSchema = new mongoose.Schema({
  resource: String,
  date: String,
  time: String,
  duration: Number,
  details: String,
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  submittedAt: { type: Date, default: Date.now },
  submittedBy: String
});
const Booking = dbBookings.model('Booking', bookingSchema);

// --------------------------
// Routes
// --------------------------

// ---------- Finance Routes (File 1) ----------

// POST /api/budgets - Create a new finance budget
app.post('/api/budgets', async (req, res) => {
  try {
    const budget = new FinanceBudget(req.body);
    await budget.save();
    res.status(201).json(budget);
    io.emit('new-budget', budget);
    io.emit('notification', `Budget "${budget.title}" has been added.`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/budgets - Retrieve all finance budgets
app.get('/api/budgets', async (req, res) => {
  try {
    const { category, fiscal_year, department } = req.query;
    let query = {};
    if (category) query.category = category;
    if (fiscal_year) query.fiscal_year = fiscal_year;
    if (department) query.department = department;
    const budgets = await FinanceBudget.find(query).sort('-created_at');
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/expenses - Create a new expense with file uploads
app.post('/api/expenses', uploadProof.array('proofs', 5), async (req, res) => {
  try {
    const files = req.files
      ? req.files.map(file => ({
          filename: file.filename,
          path: file.path,
          upload_date: new Date()
        }))
      : [];
    const expense = new Expense({ ...req.body, proof_files: files });
    await expense.save();
    res.status(201).json(expense);
    io.emit('new-expense', expense);
    io.emit('notification', `Expense of $${expense.amount} has been submitted.`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/expenses - Retrieve expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const { budget_id, status } = req.query;
    let query = {};
    if (budget_id) query.budget_id = budget_id;
    if (status) query.status = status;
    const expenses = await Expense.find(query).populate('budget_id').sort('-created_at');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/sponsors - Create a new sponsor
app.post('/api/sponsors', async (req, res) => {
  try {
    const sponsor = new Sponsor(req.body);
    await sponsor.save();
    res.status(201).json(sponsor);
    io.emit('notification', `Sponsor "${sponsor.sponsor_name}" has been added.`);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/sponsors - Retrieve sponsors
app.get('/api/sponsors', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;
    const sponsors = await Sponsor.find(query).sort('-created_at');
    res.json(sponsors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analytics/budget-utilization - Analytics for budgets
app.get('/api/analytics/budget-utilization', async (req, res) => {
  try {
    const { fiscal_year } = req.query;
    const budgets = await FinanceBudget.aggregate([
      { $match: { fiscal_year } },
      {
        $lookup: {
          from: 'expenses', // collection name (ensure it matches)
          localField: '_id',
          foreignField: 'budget_id',
          as: 'expenses'
        }
      },
      {
        $project: {
          title: 1,
          amount: 1,
          total_expense: { $sum: '$expenses.amount' }
        }
      }
    ]);
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------- Complaints Routes (File 2) ----------

// POST /complaints - Submit a complaint
app.post('/complaints', async (req, res) => {
  try {
    const { text, domain, studentId, isAnonymous } = req.body;
    const trackingId = `TPC${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const complaint = new Complaint({ text, domain, studentId, isAnonymous, trackingId });
    const savedComplaint = await complaint.save();
    res.status(201).json(savedComplaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /complaints - Get all complaints
app.get('/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ submissionDate: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /complaints/pending - Get pending complaints (for teacher view)
app.get('/complaints/pending', async (req, res) => {
  try {
    const complaints = await Complaint.find({
      status: { $in: ["Pending", "In Progress"] }
    }).sort({ submissionDate: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /complaints/:id - Update a complaint (teacher action)
app.patch('/complaints/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedComplaint = await Complaint.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedComplaint)
      return res.status(404).json({ error: "Complaint not found" });
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------- Club Management Routes (File 3) ----------

// Applications API

// GET /applications - Retrieve all applications
app.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find().sort({ submittedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /applications - Create a new application
app.post('/applications', async (req, res) => {
  try {
    const { type, title, description } = req.body;
    if (!type || !title || !description) {
      return res.status(400).json({ error: 'Type, title, and description are required.' });
    }
    const newApplication = new Application({ type, title, description });
    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /applications/:id - Update application (e.g., teacher action)
app.patch('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedApp = await Application.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedApp)
      return res.status(404).json({ error: "Application not found" });
    res.json(updatedApp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /applications/priority/update - Update application priorities based on elapsed time
app.patch('/applications/priority/update', async (req, res) => {
  try {
    const apps = await Application.find({ status: 'Pending' });
    const updatePromises = apps.map(async (appDoc) => {
      const elapsed = Date.now() - appDoc.submittedAt;
      const newPriority = Math.floor(elapsed / 10000); // Increase every 10 seconds
      appDoc.priority = newPriority;
      return appDoc.save();
    });
    await Promise.all(updatePromises);
    const updatedApplications = await Application.find().sort({ submittedAt: -1 });
    res.json({ success: true, applications: updatedApplications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Club Budgets API (renamed route prefix to avoid conflict)
// GET /club/api/budgets - Retrieve club budget records
app.get('/club/api/budgets', async (req, res) => {
  try {
    const budgets = await ClubBudget.find().sort({ submittedAt: -1 });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching club budgets' });
  }
});

// POST /club/api/budgets - Create a new club budget record with file uploads
app.post('/club/api/budgets', uploadBudget.array('files'), async (req, res) => {
  const { title, amount, type } = req.body;
  if (!title || !amount || !type) {
    return res.status(400).json({ error: 'Title, amount, and type are required.' });
  }
  const filePaths = req.files.map(file => file.path);
  try {
    const newBudget = new ClubBudget({
      title,
      amount,
      type,
      files: filePaths,
    });
    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(500).json({ error: 'Error creating club budget record' });
  }
});

// ---------- Booking Routes (File 4) ----------

// Socket.IO connection for booking events (additional log; note that io already exists)
io.on('connection', (socket) => {
  // Log connections from any client (both finance and booking modules)
  console.log('A client connected');
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// GET /bookings - Retrieve all bookings
app.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ submittedAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /bookings - Create a new booking
app.post('/bookings', async (req, res) => {
  const booking = new Booking(req.body);
  try {
    const newBooking = await booking.save();
    io.emit('newBooking', newBooking);
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /bookings/:id - Update booking status
app.patch('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    io.emit('bookingUpdated', booking);
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /bookings/:id - Delete a booking
app.delete('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (booking) {
      io.emit('bookingDeleted', booking);
      res.json({ message: 'Booking deleted', booking });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --------------------------
// Start the Server
// --------------------------
server.listen(PORT, () => {
  console.log(`Combined server is running on http://localhost:${PORT}`);
});
