import express from "express";
import Thread from "../models/Threads.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

/**
 * Get all threads
 */
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (error) {
    console.error("GET /thread ERROR ❌", error);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

/**
 * Get messages of a thread
 */
router.get("/thread/:id", async (req, res) => {
  try {
    const thread = await Thread.findOne({ threadId: req.params.id });

    if (!thread) {
      return res.status(404).json([]);
    }

    res.json(thread.messages);
  } catch (error) {
    console.error("GET /thread/:id ERROR ❌", error);
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

/**
 * Delete thread
 */
router.delete("/thread/:id", async (req, res) => {
  try {
    await Thread.findOneAndDelete({ threadId: req.params.id });
    res.json({ success: true });
  } catch (error) {
    console.error("DELETE /thread ERROR ❌", error);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

/**
 * Chat route
 */
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "threadId and message required" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [],
      });
    }

    thread.messages.push({ role: "user", content: message });

    const assistantReply = await getOpenAIAPIResponse(message);

    thread.messages.push({
      role: "assistant",
      content: assistantReply,
    });

    thread.updatedAt = new Date();
    await thread.save();

    res.json({ reply: assistantReply });
  } catch (error) {
    console.error("POST /chat ERROR", error.message);
    console.error(error.stack);
    res.status(500).json({
      error: "Chat processing failed",
    });
  }
});

export default router;
