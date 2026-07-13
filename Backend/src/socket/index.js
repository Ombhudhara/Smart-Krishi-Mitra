import { Server } from "socket.io";
import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";
import chatSocket from "./chatSocket.js";
import notificationSocket from "./notificationSocket.js";

let io;

// Map to track online users: Map<userId, socketId>
export const onlineUsers = new Map();

/**
 * Initializes the Socket.io server instance.
 * @param {object} server - HTTP server instance.
 */
export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        // Dynamically reflect origin to support credentials: true
        callback(null, true);
      },
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      
      if (!token) {
        return next(new Error("Authentication error: Token is required"));
      }

      // Verify JWT token
      const decoded = verifyToken(token);
      
      // Fetch user from DB
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      if (user.accountStatus !== "Active") {
        return next(new Error("Authentication error: User account is suspended or inactive"));
      }

      // Attach user to socket instance
      socket.user = user;
      next();
    } catch (err) {
      console.error("[Socket Auth] Connection handshake failed:", err.message);
      return next(new Error("Authentication error: Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    console.log(`⚡ Socket connected: ${socket.user.fullName} (${userId})`);

    // Track user online status
    onlineUsers.set(userId, socket.id);
    // Broadcast to all clients that this user is online
    io.emit("userOnline", userId);

    // Join a room named after the userId for targeted notifications & direct messages
    socket.join(userId);

    // Send the current list of online users to the newly connected user
    socket.emit("onlineUsers", Array.from(onlineUsers.keys()));

    socket.on("disconnect", () => {
      console.log(`🔌 Socket disconnected: ${socket.user.fullName} (${userId})`);
      onlineUsers.delete(userId);
      // Broadcast to all clients that this user is offline
      io.emit("userOffline", userId);
    });

    // Initialize sub-socket routers
    chatSocket(socket, io);
    notificationSocket(socket, io);
  });

  return io;
};

/**
 * Emits an event to a specific user's socket room.
 * @param {string} userId - Recipient User ID.
 * @param {string} event - Event name.
 * @param {any} data - Event payload.
 */
export const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(userId.toString()).emit(event, data);
    return true;
  }
  console.warn(`[Socket Manager] Cannot emit event "${event}". Socket.io is not initialized.`);
  return false;
};

export default {
  initSocket,
  emitToUser
};
