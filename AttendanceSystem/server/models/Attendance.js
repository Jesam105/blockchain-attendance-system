const mongoose = require("mongoose"); // Import Mongoose library for MongoDB object modeling

const attendanceSchema = new mongoose.Schema({ // Define a new Mongoose schema for attendance
    studentId: { type: String, required: true }, // Define a studentId field of type String, which is required
    name: { type: String, required: true }, // Define a name field of type String, which is required
    timestamp: { type: Date, default: Date.now } // Define a timestamp field of type Date, with a default value of the current date and time
});

const Attendance = mongoose.model("Attendance", attendanceSchema); // Create a Mongoose model named "Attendance" using the attendanceSchema
module.exports = Attendance; // Export the Attendance model for use in other parts of the application