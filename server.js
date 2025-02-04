require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Email Route
app.post("/send-email", async (req, res) => {
    const { name, email, message } = req.body;

    console.log("Received Contact Form Data:", { name, email, message });

    // Validate incoming data
    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Configure transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS, // Your email app password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        //to: "skymilestravels1@gmail.com", // Recipient email (your email)
        to: email,
        subject: "Travel Enquiry",
        text: `Hello Mehul,\n\nYou have received a new travel enquiry:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nPlease reach out to the client soon.\n\nBest regards,\nYour Travel Website`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
        res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
        console.log("Error in Email!!");

        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
