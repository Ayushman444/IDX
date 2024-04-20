// EditorPage.jsx
import React, { useEffect, useRef, useState } from "react";
import toast from 'react-hot-toast';
import { Box } from "@chakra-ui/react";
import { CodeEditor } from "../components/ide/Editor";
import { useParams } from 'react-router-dom';
import { CODE_SNIPPETS } from "../Constants";
import { initSocket } from "../Socket";

export const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const languageRef = useRef(null);
  const [clients, setClients] = useState([]);
  const { roomId } = useParams();

  useEffect(() => {
    const initializeSocket = async () => {
      const socket = await initSocket(); // Initialize socket connection
      socketRef.current = socket;

      socket.emit('join', {
        roomId,
        username: 'dummyUser',
      });

      socket.on('joined', ({ clients, username, socketId }) => {
        if (username !== '') {
          toast.success(`${username} joined the room.`);
          console.log(`${username} joined`);
        }
        setClients(clients);
        socket.emit('sync_code', {
          code: codeRef.current,
          language: languageRef.current,
          socketId,
        });
      });

      // Listening for disconnected
      socket.on(
        'disconnected',
        ({ socketId, username }) => {
          toast.success(`${username} left the room.`);
          setClients((prev) => {
            return prev.filter(
              (client) => client.socketId !== socketId
            );
          });
        }
      );
    };


    initializeSocket();

    return () => {
      // Cleanup function to disconnect socket when component unmounts
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off('joined');
        socketRef.current.off('disconnected');
      }
    };
  }, [roomId]);

  return (
    <Box minH="100vh" bg="#0f0a19" color="gray.500" px={6} py={8}>
      <CodeEditor roomId={roomId} socket={socketRef} onCodeChange={(code) => { codeRef.current = code; }} onLanguageChange={(language) => { languageRef.current = language; }} />
    </Box>
  );
};
