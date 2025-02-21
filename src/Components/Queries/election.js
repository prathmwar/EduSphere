// import React, { useState, useEffect } from 'react';
// import { Vote, Users, Clock, CheckCircle } from 'lucide-react';

// const Election = () => {
//   // State for election data
//   const [election, setElection] = useState({
//     id: 1,
//     title: "Student Council President Election",
//     description: "Vote for your next Student Council President for the academic year 2025-26",
//     startDate: "2025-02-15",
//     endDate: "2025-03-01",
//     status: "active",
//     totalVotes: 0,
//     candidates: [
//       { id: 1, name: "Alice Smith", position: "President", votes: 0, manifesto: "Building a better campus together" },
//       { id: 2, name: "Bob Johnson", position: "President", votes: 0, manifesto: "Innovation in student leadership" },
//       { id: 3, name: "Carol White", position: "President", votes: 0, manifesto: "Empowering student voices" }
//     ]
//   });

//   // User state
//   const [userVote, setUserVote] = useState(null);
//   const [notification, setNotification] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [timeLeft, setTimeLeft] = useState("");

//   // Calculate time remaining
//   useEffect(() => {
//     const calculateTimeLeft = () => {
//       const endTime = new Date(election.endDate).getTime();
//       const now = new Date().getTime();
//       const difference = endTime - now;

//       if (difference > 0) {
//         const days = Math.floor(difference / (1000 * 60 * 60 * 24));
//         const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//         setTimeLeft(`${days}d ${hours}h remaining`);
//       } else {
//         setTimeLeft("Election ended");
//         setElection(prev => ({ ...prev, status: "completed" }));
//       }
//     };

//     calculateTimeLeft();
//     const timer = setInterval(calculateTimeLeft, 1000 * 60); // Update every minute
//     return () => clearInterval(timer);
//   }, [election.endDate]);

//   // Handle voting
//   const handleVote = async (candidateId) => {
//     setLoading(true);
//     try {
//       // Simulate API call delay
//       await new Promise(resolve => setTimeout(resolve, 1000));

//       setElection(prev => ({
//         ...prev,
//         candidates: prev.candidates.map(candidate =>
//           candidate.id === candidateId
//             ? { ...candidate, votes: candidate.votes + 1 }
//             : candidate
//         ),
//         totalVotes: prev.totalVotes + 1
//       }));

//       setUserVote(candidateId);
//       showNotification("Vote cast successfully!");
//     } catch (error) {
//       showNotification("Error casting vote. Please try again.");
//     }
//     setLoading(false);
//   };

//   // Show notification
//   const showNotification = (message) => {
//     setNotification(message);
//     setTimeout(() => setNotification(null), 3000);
//   };

//   // Calculate vote percentages
//   const calculatePercentage = (votes) => {
//     if (election.totalVotes === 0) return 0;
//     return ((votes / election.totalVotes) * 100).toFixed(1);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       {notification && (
//         <div className="mb-4 p-4 bg-blue-100 border border-blue-200 text-blue-800 rounded">
//           {notification}
//         </div>
//       )}

//       {/* Election Card */}
//       <div className="mb-6 border rounded-lg shadow-md bg-slate-800 text-slate-100 p-6">
//         {/* Card Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold">{election.title}</h2>
//             <p className="text-sm text-gray-300">{election.description}</p>
//           </div>
//           <span
//             className={`px-2 py-1 rounded capitalize ${
//               election.status === "active"
//                 ? "bg-green-100 text-green-800"
//                 : "bg-gray-200 text-gray-800"
//             }`}
//           >
//             {election.status}
//           </span>
//         </div>

//         {/* Card Content */}
//         <div className="mt-4">
//           <div className="grid grid-cols-2 gap-4 mb-6">
//             <div className="flex items-center space-x-2">
//               <Clock className="h-4 w-4 text-gray-400" />
//               <span className="text-sm text-gray-400">{timeLeft}</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Users className="h-4 w-4 text-gray-400" />
//               <span className="text-sm text-gray-400">
//                 {election.totalVotes} total votes
//               </span>
//             </div>
//           </div>

//           {/* Candidates List */}
//           <div className="space-y-6">
//             {election.candidates.map((candidate) => (
//               <div 
//                 key={candidate.id} 
//                 className="p-4 border rounded-lg hover:border-blue-500 transition-colors"
//               >
//                 <div className="flex items-center justify-between mb-2">
//                   <div>
//                     <h3 className="font-medium">{candidate.name}</h3>
//                     <p className="text-sm text-gray-500">{candidate.manifesto}</p>
//                   </div>
//                   {userVote === candidate.id && (
//                     <CheckCircle className="h-5 w-5 text-green-500" />
//                   )}
//                 </div>

//                 {/* Vote Progress */}
//                 <div className="mb-2">
//                   <div className="h-2 bg-gray-600 rounded-full">
//                     <div 
//                       className="h-full bg-blue-500 rounded-full transition-all duration-500"
//                       style={{ width: `${calculatePercentage(candidate.votes)}%` }}
//                     />
//                   </div>
//                   <p className="text-sm text-gray-400 mt-1">
//                     {candidate.votes} votes ({calculatePercentage(candidate.votes)}%)
//                   </p>
//                 </div>

//                 {/* Vote Button */}
//                 {election.status === "active" && !userVote && (
//                   <button
//                     onClick={() => handleVote(candidate.id)}
//                     disabled={loading || userVote !== null}
//                     className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded disabled:opacity-70 transition-colors"
//                   >
//                     <div className="flex items-center justify-center">
//                       <Vote className="h-4 w-4 mr-2" />
//                       {loading ? "Casting Vote..." : "Vote"}
//                     </div>
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Election;

import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017/paperjs"; // your MongoDB connection string
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const block = req.body;

  // Validate: Skip the genesis block and require a wallet address
  if (!block || !block.wallet || block.candidateId === "GENESIS") {
    return res.status(400).json({ message: "Invalid vote submission" });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db();
    // Check if this wallet has already voted (only non-genesis blocks)
    const existingVote = await db
      .collection("blocks")
      .findOne({ wallet: block.wallet, candidateId: { $ne: "GENESIS" } });
    if (existingVote) {
      return res.status(400).json({ message: "User has already voted" });
    }

    // Save the new vote block
    await db.collection("blocks").insertOne(block);
    return res.status(200).json({ message: "Vote recorded" });
  } catch (error) {
    console.error("Error saving block:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

