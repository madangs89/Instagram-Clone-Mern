import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

const io = new Server(3005, {
  cors: {
    origin: "http://localhost:5173",
  },
});
const pubClient = createClient({
  url: "rediss://default:AVgAAAIjcDEwZWNhMmEzNDViMjE0M2I4OGU5NjUzNzg3MGRmM2UyNHAxMA@crucial-boar-22528.upstash.io:6379",
});
const subClient = pubClient.duplicate();

await pubClient.connect();
await subClient.connect();

io.adapter(createAdapter(pubClient, subClient));

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg); // goes through Redis adapter now
  });
});
