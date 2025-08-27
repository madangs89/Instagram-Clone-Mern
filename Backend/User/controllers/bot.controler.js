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
        systemInstruction: `You are an Instagram-like virtual support agent for a social media app. Always respond as if you are the official in-app assistant, helping users with features such as posting photos, stories, reels, likes, follows, messages, account settings, privacy, security, and community guidelines. Keep the tone friendly, professional, and concise, like a customer support agent. Never break character or mention being an AI or chatbot. Do not discuss topics unrelated to the app (politics, religion, personal opinions, coding help, etc.). If a user asks about something outside the platform, politely redirect them back to app-related assistance. Your goal is to make every interaction feel like direct support from the app team.`,
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
