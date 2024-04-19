const { Server } = require('socket.io');
const http = require('http'); // Import the http module

function getAllConnectedClients(io, roomId, userSocketMap) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        };
    });
}

const socketLogic = () => {
    // Create an HTTP server
    const server = http.createServer();
    const io = new Server(server);
    const userSocketMap = {};

    io.on('connection', (socket) => {
        console.log('socket connected', socket.id);

        socket.on('join', ({ roomId, username }) => {
            userSocketMap[socket.id] = username;
            socket.join(roomId);
            const clients = getAllConnectedClients(io, roomId, userSocketMap);
            clients.forEach(({ socketId }) => {
                io.to(socketId).emit('joined', {
                    clients,
                    username,
                    socketId: socket.id,
                });
            });
        });

        socket.on('code_change', ({ roomId, code }) => {
            socket.in(roomId).emit('code_change', { code });
        });

        socket.on('sync_code', ({ socketId, code }) => {
            io.to(socketId).emit('code_change', { code });
        });

        socket.on('disconnecting', () => {
            const rooms = [...socket.rooms];
            rooms.forEach((roomId) => {
                socket.in(roomId).emit('disconnected', {
                    socketId: socket.id,
                    username: userSocketMap[socket.id],
                });
            });
            delete userSocketMap[socket.id];
            socket.leave();
        });
    });

    // Return the server instance
    return server;
};

module.exports = socketLogic;
