import express from 'express';
import Thread  from '../models/Threads.js';
import getOpenAIAPIResponse from '../utils/openai.js';

const router = express.Router();

// Create a new thread  

//test thread
router.post('/test', async (req, res) => {
    try {
        const thread = new Thread({
        threadId: "abcd1234",
        title: "Test Thread02",
        });

        const response = await thread.save();
        res.send(response);

    } catch (error) {
        console.error('Error creating test thread:', error);
        res.status(500).json({ error: 'An error occurred while creating test thread' });
    }
});

// Get all threads
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });     
        //descending order of updatedAt ... most recent data on top   
        res.json(threads);
    }
    catch (error) {
        console.error("Error fetching threads:", error);
        res.status(500).json({ error: "An error occurred while fetching threads" });
    }       
});

// get specific thread by id
router.get("/thread/:id", async (req, res) => {
    const threadId = req.params.id;

    try {
        const thread = await Thread.findOne({ threadId });

        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.json(thread.messages);
    } catch (error) {
        console.error("Error fetching thread:", error);
        res.status(500).json({ error: "An error occurred while fetching the thread" });
    }
});

// Delete a specific thread by id
router.delete("/thread/:id", async (req, res) => {
    const threadId = req.params.id;

    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId });

        if (!deletedThread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        res.status(200).json({ success: "Thread deleted successfully!" });

    } catch (error) {
        console.error("Error deleting thread:", error);
        res.status(500).json({ error: "An error occurred while deleting the thread" });
    }
});

// if we have exixting thread then update it otherwise create new thread
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "missing required fields" });
    }

    try {
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            // Create a new thread if it doesn't exist
            thread = new Thread({
                threadId,
                title: message,
                messages: [{ role: "user", content: message }],
            });
        } else {
            // Update the existing thread
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply = await getOpenAIAPIResponse(message);

        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        await thread.save();
        res.json({ reply: assistantReply  });

    } catch (error) {
        console.error("Error in /chat route:", error);
        res.status(500).json({ error: "An error occurred while processing the chat message" });
    };
});

export default router;
