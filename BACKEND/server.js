import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';
import cors from 'cors';
import  'dotenv/config';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",        
      "https://mychatgpt-seven-theta.vercel.app/"  
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use("/api", chatRoutes);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Database!');

    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
    }
};


// app.post('/test', async (req, res) => {
//     const options = {
//         method: 'POST',
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "llama-3.3-70b-versatile",
//             messages: [
//                 { 
//                     role: "user", 
//                     content: req.body.message, 
//                 }
//             ]
//         })
//     };

//     try {
//         const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options); 
//         const data = await response.json();
//         //console.log(data.choices[0].message.content);
//         res.send(data.choices[0].message.content);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'An error occurred' });
//     }
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

