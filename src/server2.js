// // server.js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { MongoClient } = require('mongodb');
// const { ethers } = require('ethers');
// const { Web3Storage } = require('web3.storage');

// const app = express();
// app.use(express.json());
// app.use(cors());

// // MongoDB connection details
// const mongoUrl = 'mongodb://localhost:27017';
// const dbName = 'q1';

// // NFT contract details from environment variables
// const NFT_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Hardcoded NFT contract address
// const RPC_URL = "https://polygon-mumbai.g.alchemy.com/v2/BLE19jcEKgty8__DCg68YbHyQnrT-u3k"; // Hardcoded RPC URL
// const PRIVATE_KEY = "0x94F1573D98D18E714D14f5D9e1C79E9A5322011B";
// const DEFAULT_STUDENT_WALLET = "0x94F1573D98D18E714D14f5D9e1C79E9A5322011B"; // address to mint NFT to

// // Minimal ABI that supports the mint function
// const nftAbi = [
//   "function mint(address recipient, string memory tokenURI) public returns (uint256)"
// ];

// // Setup ethers provider, wallet, and contract instance
// const provider = new ethers.JsonRpcProvider(RPC_URL);
// const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
// const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, nftAbi, wallet);

// // Setup Web3.Storage client (if using IPFS)
// const WEB3_STORAGE_TOKEN = process.env.WEB3_STORAGE_TOKEN;
// function getWeb3StorageClient() {
//   return new Web3Storage({ token: WEB3_STORAGE_TOKEN });
// }

// async function uploadMetadataToIPFS(metadata) {
//   if (!WEB3_STORAGE_TOKEN) {
//     console.log("WEB3_STORAGE_TOKEN not provided, skipping IPFS upload.");
//     return "";
//   }
//   const client = getWeb3StorageClient();
//   const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
//   const file = new File([blob], 'metadata.json');
//   try {
//     const cid = await client.put([file]);
//     return `https://ipfs.io/ipfs/${cid}`;
//   } catch (error) {
//     console.error("IPFS upload error:", error);
//     return "";
//   }
// }

// // POST /student endpoint: stores registration data and mints an NFT
// app.post('/student', async (req, res) => {
//   const student = req.body; // expected: { name, email, course, username, password }
//   if (!student || !student.name || !student.email) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   let client;
//   try {
//     // Connect to MongoDB and store student data
//     client = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
//     const db = client.db(dbName);
//     const result = await db.collection('students').insertOne(student);

//     // Create NFT metadata object
//     const metadata = {
//       name: student.name,
//       description: "Student Registration NFT",
//       attributes: [
//         { trait_type: "Email", value: student.email },
//         { trait_type: "Course", value: student.course },
//         { trait_type: "Username", value: student.username }
//       ]
//     };

//     // Upload metadata to IPFS (if token provided)
//     const tokenURI = await uploadMetadataToIPFS(metadata);

//     // Mint the NFT using the contract's mint function
//     // In this example, we mint to DEFAULT_STUDENT_WALLET; adjust as needed.
//     const mintTx = await nftContract.mint(DEFAULT_STUDENT_WALLET, tokenURI);
//     await mintTx.wait();

//     res.status(200).json({ message: "Student registered and NFT minted successfully", tokenURI });
//   } catch (error) {
//     console.error("Error in /student:", error);
//     res.status(500).json({ message: "Internal server error", error: error.toString() });
//   } finally {
//     if (client) client.close();
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });


// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/loginform", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define the Student schema and model
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  course: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Student = mongoose.model("Student", studentSchema);

// POST route to register a new student
app.post("/student", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({
      message:
        error.message || "An error occurred while registering the student.",
    });
  }
});

// Start the server on port 6000
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});