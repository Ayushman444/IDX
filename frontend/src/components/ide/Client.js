import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

export const Client = () => {
    const [connectedUsers, setConnectedUsers] = useState([]);

    useEffect(() => {
        const socket = socketIOClient('http://localhost:8000');

        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('update_users', (users) => {
            setConnectedUsers(users);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>Connected Users</h1>
            <ul>
                {connectedUsers.map((user) => (
                    <li key={user.socketId}>{user.username}</li>
                ))}
            </ul>
        </div>
    );
};

