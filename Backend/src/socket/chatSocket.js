/**
 * Socket.io events handler for chat / real-time messaging.
 * @param {object} socket - Connected socket instance.
 * @param {object} io - Socket.io server instance.
 */
export default (socket, io) => {
  // Listen for user typing state and relay to the recipient
  socket.on("typing", ({ conversationId, receiverId }) => {
    if (receiverId) {
      io.to(receiverId.toString()).emit("userTyping", {
        conversationId,
        senderId: socket.user._id.toString()
      });
    }
  });

  // Listen for user stop typing state and relay to the recipient
  socket.on("stopTyping", ({ conversationId, receiverId }) => {
    if (receiverId) {
      io.to(receiverId.toString()).emit("userStopTyping", {
        conversationId,
        senderId: socket.user._id.toString()
      });
    }
  });
};
