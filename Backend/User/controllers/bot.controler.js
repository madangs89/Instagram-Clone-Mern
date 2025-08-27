import { ai } from "../utils/aiStudio.js";

export const chat = async (req, res) => {
  try {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    console.log(req.body);

    const message = req.body.message;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: `You are a helpful assistant. 
When users ask about general knowledge, technology, or other topics, answer normally. 
When users specifically ask about Instagram-like features (posting, reels, stories, account settings, privacy, etc.), respond as if you are the official in-app Instagram support assistant: friendly, professional, and concise. 
Outside of that context, you may respond as a general assistant. 
`,
      },
    });
    for await (const chunk of response) {
      console.log(chunk.text);
      const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (text) {
        res.write(text + "\n"); // ✅ force flush with newline
      }
    }
    res.end();
  } catch (error) {
    console.error("Error in chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
