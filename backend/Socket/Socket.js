const { Server } = require('socket.io');
const http = require('http');

function getAllConnectedClients(io, roomId, userSocketMap) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || [])
        .filter((socketId) => userSocketMap.hasOwnProperty(socketId))
        .map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        };
    });
}

const socketLogic = (app) => {

    const server = http.createServer(app);
    const io = new Server(server);
    const userSocketMap = {};
    const roomAccessMap = {};
    const cursorLocations = {};

    io.on('connection', (socket) => {
        console.log('socket connected', socket.id);

        socket.on('join', ({ roomId, username, access }) => {
            userSocketMap[socket.id] = username;
            socket.join(roomId);

            roomAccessMap[roomId] = roomAccessMap[roomId] || {};
            roomAccessMap[roomId][socket.id] = access || 'edit';

            const clients = getAllConnectedClients(io, roomId, userSocketMap);
            clients.forEach(({ socketId }) => {
                io.to(socketId).emit('joined', {
                    clients,                              // 
                    username,
                    socketId: socket.id,
                });
            });

            if (cursorLocations[roomId]) {
                Object.entries(cursorLocations[roomId]).forEach(([socketId, cursor]) => {
                    io.to(socket.id).emit('update_cursor', {
                        socketId,
                        cursor,
                    });
                });
            }
            
            updateConnectedUsers(io, roomId, userSocketMap);
        });

        socket.on('code_change', ({ roomId, code, language }) => {
            if (roomAccessMap[roomId] && roomAccessMap[roomId][socket.id] === 'edit') {
                socket.in(roomId).emit('code_change', { code, language });
            } else {

                io.to(socket.id).emit('access_denied', {
                    message: 'You do not have permission to edit the code.',
                });
            }
        });

        socket.on('sync_code', ({ code,language,socketId }) => {
            io.to(socketId).emit('code_change', { code,language });
        });

        socket.on('access_change', ({ roomId, targetSocketId, access }) => {
            if (roomAccessMap[roomId] && roomAccessMap[roomId][socket.id] === 'edit') {
                roomAccessMap[roomId][targetSocketId] = access;
                
                
                io.to(targetSocketId).emit('access_changed', {
                    roomId,
                    access,
                });
            }
        });

        socket.on('cursor_position', ({ roomId, cursorPosition ,username}) => {
            io.to(roomId).emit('cursor_position', { cursorPosition,username });
            console.log('usrnm',username);
        console.log('position',cursorPosition)
        });

        socket.on('disconnecting', () => {
            const rooms = [...socket.rooms];
            console.log("socketid mil gayi ", socket.id);
            const usersocketmp = userSocketMap[socket.id];
            delete userSocketMap[socket.id];
            rooms.forEach((roomId) => {
                socket.in(roomId).emit('disconnected', {
                    socketId: socket.id,
                    username: usersocketmp,
                });

                if (roomAccessMap[roomId]) {
                    delete roomAccessMap[roomId][socket.id];
                }

                if(cursorLocations[roomId]){
                    delete cursorLocations[roomId][socket.id];
                }

                // io.sockets.adapter.del(roomId, socket.id);
                updateConnectedUsers(io, roomId, userSocketMap);

            });
            socket.leave();
            console.log('socket disconnected : ', socket.id);
        });

        socket.on('cursor_position', ({ roomId, cursor }) => {
            if (roomAccessMap[roomId] && roomAccessMap[roomId][socket.id] === 'edit') {
                cursorLocations[roomId] = cursorLocations[roomId] || {};
                cursorLocations[roomId][socket.id] = cursor;
        
                socket.in(roomId).emit('update_cursor', {
                    socketId: socket.id,
                    cursor,
                });
            }
        });
    });

    const updateConnectedUsers = (io, roomId, userSocketMap) => {
        const clients = getAllConnectedClients(io, roomId, userSocketMap);
        console.log(clients);
        io.to(roomId).emit('update_users', clients);
    };

    return server;
};

module.exports = socketLogic;
