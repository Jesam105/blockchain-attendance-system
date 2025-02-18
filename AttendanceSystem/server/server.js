require('dotenv').config(); // Load environment variables from a .env file into process.env
const express = require("express"); // Import Express framework
const cors = require("cors"); // Import CORS middleware to enable Cross-Origin Resource Sharing
const bodyParser = require("body-parser"); // Import body-parser middleware to parse incoming request bodies
const mongoose = require("mongoose"); // Import Mongoose library for MongoDB object modeling
const Blockchain = require("./blockchain"); // Import custom Blockchain class
const Attendance = require("./models/Attendance"); // Import Attendance model

const app = express(); // Create an Express application
const port = 3000; // Define the port number for the server

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse incoming request bodies in JSON format

mongoose.connect(process.env.MONGO_URL) // Connect to MongoDB using the connection string from environment variables
    .then(() => console.log('MongoDB Connected')) // Log success message if connection is successful
    .catch(err => console.error('MongoDB Connection Error:', err)); // Log error message if connection fails

const blockchain = new Blockchain(); // Create a new instance of the Blockchain class

app.post("/mark-attendance", async (req, res) => { // Define a POST route for marking attendance
    const { studentId, name } = req.body; // Extract studentId and name from the request body

    if (!studentId || !name) { // Check if studentId or name is missing
        return res.status(400).json({ error: "Student ID and Name are required." }); // Return a 400 Bad Request response if either is missing
    }

    try {
        const attendance = new Attendance({ studentId, name, timestamp: new Date() }); // Create a new Attendance document
        await attendance.save(); // Save the Attendance document to MongoDB

        blockchain.createNewTransaction(studentId, name, "Present"); // Add a new transaction to the blockchain

        return res.json({ message: "Attendance recorded. Please mine a block to finalize." }); // Return a success response
    } catch (err) {
        console.error("Error saving attendance:", err); // Log error message if saving fails
        res.status(500).json({ error: "Failed to record attendance" }); // Return a 500 Internal Server Error response
    }
});

app.get("/mine", (req, res) => { // Define a GET route for mining a new block
    try {
        const lastBlock = blockchain.getLastBlock(); // Get the last block from the blockchain
        const previousBlockHash = lastBlock.hash; // Get the hash of the last block
        const currentBlockData = blockchain.pendingTransactions; // Get the pending transactions
        const nonce = blockchain.proofOfWork(previousBlockHash, currentBlockData); // Find the nonce for the new block
        const blockHash = blockchain.hashBlock(previousBlockHash, currentBlockData, nonce); // Calculate the hash for the new block
        const newBlock = blockchain.createNewBlock(nonce, previousBlockHash, blockHash); // Create a new block with the calculated values

        res.json({ message: "New block mined!", newBlock }); // Return a success response with the new block
    } catch (err) {
        console.error("Error mining block:", err); // Log error message if mining fails
        res.status(500).json({ error: "Failed to mine block" }); // Return a 500 Internal Server Error response
    }
});

app.get("/attendance-records", async (req, res) => { // Define a GET route for retrieving attendance records
    try {
        const blockchainRecords = blockchain.getAllTransactions(); // Get all transactions from the blockchain
        const dbRecords = await Attendance.find(); // Fetch all attendance records from MongoDB

        console.log("Blockchain Records:", blockchainRecords); // Log blockchain records
        console.log("Database Records:", dbRecords); // Log database records

        res.json({ records: [...blockchainRecords, ...dbRecords] }); // Return a success response with combined records
    } catch (err) {
        console.error("Error retrieving records:", err); // Log error message if retrieval fails
        res.status(500).json({ error: "Failed to retrieve attendance records" }); // Return a 500 Internal Server Error response
    }
});

app.listen(port, () => { // Start the server and listen on the defined port
    console.log(`Server running at http://localhost:${port}`); // Log a message indicating the server is running
});