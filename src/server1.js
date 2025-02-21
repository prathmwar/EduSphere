const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 6000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/paperjs', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Block schema and model
const blockSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  timestamp: { type: String, required: true },
  candidateId: { type: String, required: true },
  candidateName: { type: String, required: true },
  wallet: { type: String },
  previousHash: { type: String, required: true },
  hash: { type: String, required: true },
});

const Block = mongoose.model('Block', blockSchema);

// Endpoint to save a new vote block
app.post('/election', async (req, res) => {
  try {
    const blockData = req.body;
    // Create and save the block document
    const block = new Block(blockData);
    await block.save();
    res.status(201).json({ message: "Block saved successfully" });
  } catch (error) {
    console.error("Error saving block:", error);
    res.status(500).json({ message: "Error saving block" });
  }
});

// (Optional) Endpoint to fetch all vote blocks (for real-time results)
app.get('/election', async (req, res) => {
  try {
    const blocks = await Block.find();
    res.status(200).json(blocks);
  } catch (error) {
    console.error("Error fetching blocks:", error);
    res.status(500).json({ message: "Error fetching blocks" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});