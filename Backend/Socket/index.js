import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

const io = new Server(3005, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// Main Redis clients for adapter
const pubClient = createClient({
  url: "rediss://default:AVgAAAIjcDEwZWNhMmEzNDViMjE0M2I4OGU5NjUzNzg3MGRmM2UyNHAxMA@crucial-boar-22528.upstash.io:6379",
});
const subClient = pubClient.duplicate();

await pubClient.connect();
await subClient.connect();

io.adapter(createAdapter(pubClient, subClient));

// 🔹 Create a **separate** subscriber for custom events
const customSubClient = pubClient.duplicate();
await customSubClient.connect();

// Handle newMessage from other microservices
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
// Handle markAsRead events
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
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("a user connected", userId, socket.id);
  // Save user online state
  pubClient.hSet(
    "onlineUsers",
    userId,
    JSON.stringify({ socketId: socket.id, conversationId: "" })
  );

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
