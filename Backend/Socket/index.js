import dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import cors from "cors";

import express from "express";
import http from "http";

const app = express();
const s = http.createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

const io = new Server(s, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});
// Main Redis clients for adapter
const pubClient = createClient({
  url: "rediss://default:AUMzAAIncDFiYTMxNzk4ODBjZTY0NzMxODE1OTkxZTJmY2I3NDA2NnAxMTcyMDM@enjoyed-bullfrog-17203.upstash.io:6379",
});
const subClient = pubClient.duplicate();
pubClient.on("error", (err) => console.log("Redis Client Error", err));
subClient.on("error", (err) => console.log("Redis Client Error", err));
await pubClient.connect();
await subClient.connect();

io.adapter(createAdapter(pubClient, subClient));

const customPubClient = pubClient.duplicate();
await customPubClient.connect();
const customSubClient = pubClient.duplicate();
await customSubClient.connect();

await customSubClient.subscribe("newMessage", async (data) => {
  const { receiverId, message } = JSON.parse(data);
  const isUserOnline = await pubClient.hGet("onlineUsers", receiverId);
  if (isUserOnline) {
    const { socketId } = JSON.parse(isUserOnline);
    io.to(socketId).emit("message", message);
  }
});
await customSubClient.subscribe("newNotification", async (data) => {
  const { receiver } = JSON.parse(data);
  console.log(data);
  console.log("receiver", receiver);

  const isUserOnline = await pubClient.hGet("onlineUsers", receiver);
  if (isUserOnline) {
    const { socketId } = JSON.parse(isUserOnline);
    io.to(socketId).emit("newNotification", receiver);
  }
});
await customSubClient.subscribe("markAsRead", async (data) => {
  const { receiverId, conversationId, modified } = JSON.parse(data);
  const isUserOnline = await pubClient.hGet("onlineUsers", receiverId);

  if (isUserOnline) {
    const { socketId } = JSON.parse(isUserOnline);
    console.log("marksRead", receiverId, conversationId, modified);

    io.to(socketId).emit("markAsRead", {
      conversationId,
      receiverId,
      modified,
    });
  }
});
await customSubClient.subscribe("readTheConversation", async (data) => {
  const { receiverId, conversationId, modified } = JSON.parse(data);
  const isUserOnline = await pubClient.hGet("onlineUsers", receiverId);

  if (isUserOnline) {
    const { socketId } = JSON.parse(isUserOnline);
    console.log("readTheConversation", receiverId, conversationId, modified);

    io.to(socketId).emit("readTheConversation", {
      conversationId,
      receiverId,
      modified,
    });
  }
});
await customSubClient.subscribe("userComesOnline", async (data) => {
  const result = JSON.parse(data);
  if (Array.isArray(result) && result.length > 0) {
    for (const user of result) {
      const { sender, conversationIds: conversationId } = user;
      const isUserOnline = await pubClient.hGet("onlineUsers", sender); // ← await here

      if (isUserOnline) {
        const { socketId } = JSON.parse(isUserOnline);
        console.log("marking the message as delivered", socketId);

        io.to(socketId).emit("userComesOnline", conversationId);
      }
    }
  }
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (!userId) return socket.disconnect();
  console.log("a user connected", userId, socket.id);
  // Save user online state
  pubClient.hSet(
    "onlineUsers",
    userId,
    JSON.stringify({ socketId: socket.id, conversationId: "" })
  );

  customPubClient.publish("userOnline", JSON.stringify({ userId }));
  // When user opens a conversation
  socket.on("openedConversation", async (data) => {
    const { userId, conversationId } = data;
    await pubClient.hSet(
      "onlineUsers",
      userId,
      JSON.stringify({ socketId: socket.id, conversationId })
    );
  });
  // Manual remove user event
  socket.on("removeUser", async (data) => {
    const { userId } = data;
    await pubClient.hDel("onlineUsers", userId);
    socket.disconnect();
  });
  // On disconnect
  socket.on("disconnect", async () => {
    console.log("a user disconnected", userId);
    await pubClient.hDel("onlineUsers", userId);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World from Socket");
});

s.listen(process.env.PORT || 3005, () => {
  console.log(`Server is running on port ${process.env.PORT || 3005}`);
});
