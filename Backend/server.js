import express from "express";
import "dotenv/config";
import cors from "cors";
import fetch from "node-fetch"; // npm install node-fetch
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);   // register + login
app.use("/api", chatRoutes);

console.log("Loaded key:", process.env.OPENROUTER_API_KEY);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB()
});




const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database!");
    } catch(err) {
        console.log("Failed to connect with Db", err);
    }
}





// app.post("/test", async (req, res) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
//         },
//         body: JSON.stringify({
//             //1: GPT‑4o Mini
//             model: "openai/gpt-4o-mini",
//             messages: [
//                 {
//                     role: "user",
//                     content: req.body.message
//                 }
//             ]
//         })
//     };

//     try {
//         const response = await fetch("https://openrouter.ai/api/v1/chat/completions", options);
//         const data = await response.json();

//         console.log("Response from OpenRouter:", data);

//         if (data.choices && data.choices[0]) {
//             res.send(data.choices[0].message.content);
//         } else {
//             res.status(400).send(data);
//         }
//     } catch (err) {
//         console.error("Server Error:", err);
//         res.status(500).send("Failed to connect to the AI provider.");
//     }
// });
