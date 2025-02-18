const BASE_URL = "http://localhost:3000"; // Backend URL

// Function to mark attendance
async function markAttendance() {
    const studentId = document.getElementById("studentId").value.trim(); // Get and trim the student ID from the input field
    const name = document.getElementById("name").value.trim(); // Get and trim the name from the input field

    if (!studentId || !name) { // Check if either student ID or name is missing
        alert("Please enter both Student ID and Name."); // Alert the user to enter both fields
        return; // Exit the function
    }

    try {
        const response = await fetch(`${BASE_URL}/mark-attendance`, { // Send a POST request to the mark-attendance endpoint
            method: "POST", // Specify the request method as POST
            headers: {
                "Content-Type": "application/json" // Set the content type to JSON
            },
            body: JSON.stringify({ studentId, name }) // Send the student ID and name in the request body
        });

        if (!response.ok) { // Check if the response is not OK
            throw new Error(`Error: ${response.statusText}`); // Throw an error with the response status text
        }

        const result = await response.json(); // Parse the response JSON
        alert(result.message); // Alert the user with the response message
    } catch (error) {
        console.error("Error marking attendance:", error); // Log the error to the console
        alert("An error occurred while marking attendance."); // Alert the user about the error
    }
}

// Function to mine a block
async function mineBlock() {
    try {
        const response = await fetch(`${BASE_URL}/mine`); // Send a GET request to the mine endpoint

        if (!response.ok) { // Check if the response is not OK
            throw new Error(`Error: ${response.statusText}`); // Throw an error with the response status text
        }

        const result = await response.json(); // Parse the response JSON
        alert("Block mined successfully!"); // Alert the user that the block was mined successfully
        console.log(result.newBlock); // Log the new block to the console
    } catch (error) {
        console.error("Error mining block:", error); // Log the error to the console
        alert("Error mining block."); // Alert the user about the error
    }
}

// Function to view attendance
async function viewAttendance() {
    console.log("Fetching attendance records..."); // Log a message indicating that attendance records are being fetched
    const response = await fetch(`${BASE_URL}/attendance-records`); // Send a GET request to the attendance-records endpoint
    const result = await response.json(); // Parse the response JSON
    console.log("Records fetched:", result.records); // Log the fetched records to the console

    if (response.ok && result.records.length > 0) { // Check if the response is OK and there are records
        const recordsElement = document.getElementById("records"); // Get the records element from the DOM
        recordsElement.innerHTML = result.records.map(record => // Map over the records and create HTML for each record
            `<p><strong>Student ID:</strong> ${record.studentId} | <strong>Name:</strong> ${record.name} | <strong>Timestamp:</strong> ${new Date(record.timestamp).toLocaleString()}</p>`
        ).join(""); // Join the HTML strings and set it as the innerHTML of the records element
    } else {
        alert("No attendance records found."); // Alert the user if no records are found
    }
}