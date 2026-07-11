/**
 * Socket.io events handler for real-time notifications.
 * @param {object} socket - Connected socket instance.
 * @param {object} io - Socket.io server instance.
 */
export default (socket, io) => {
  // Can be used in the future to register custom notification listeners
  socket.on("notificationsRead", () => {
    console.log(`Notifications read by user: ${socket.user._id}`);
  });
};
