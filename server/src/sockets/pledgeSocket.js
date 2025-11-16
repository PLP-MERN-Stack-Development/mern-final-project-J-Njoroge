import Pledge from '../models/Pledge.js';

export const setupPledgeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join pledge room
    socket.on('join-pledge-room', () => {
      socket.join('pledge-room');
    });

    // Leave pledge room
    socket.on('leave-pledge-room', () => {
      socket.leave('pledge-room');
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

