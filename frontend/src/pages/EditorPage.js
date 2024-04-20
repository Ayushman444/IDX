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
  const [users, setUsers] = useState([]);
  const { roomId } = useParams();

  useEffect(() => {
    const initializeSocket = async () => {
      const socket = await initSocket(); // Initialize socket connection
      socketRef.current = socket;

      socket.emit('join', {
        roomId,
        username: 'dummyUser',
      });
      
      // Sidebar mein dalne hai
      socket.emit('access_change', {
        roomId,
        targetSocketId: 'dummyUser',
        access: 'read',
      });

      socket.on('access_changed', ({roomId, access}) => {
        console.log("roomid ", roomId);
        console.log("access ", access);
      });

      socket.on('access_denied', ({message}) => {
        console.log("message : ", message);
      });

      // yaha tak

      socket.on('joined', ({ client, username, socketId }) => {
        if (username !== '') {
          toast.success(`${username} joined the room.`);
          console.log(`${username} joined`);
        }
        // setClients(clients);
        socket.emit('sync_code', {
          code: codeRef.current,
          language: languageRef.current,
          socketId,
        });
      });

      socket.on('update_users', (clients) => {
        console.log("clients", clients);
        setUsers(clients);
        console.log("users", users);
      });


      // Listening for disconnected
      socket.on(
        'disconnected',
        ({ socketId, username }) => {
          toast.success(`${username} left the room.`);
          setUsers((prev) => {
            return prev.filter(
              (client) => client.socketId !== socketId
            );
          });
        }
      );

      // Cursor positions ke liye
      // editor.on('cursorActivity', () => {
      //   const cursor = editor.getCursor();
      //   socket.emit('cursor_position', {
      //       roomId: currentRoomId,
      //       cursor,
      //   });
      // });


      // socket.on('update_cursor', ({ socketId, cursor }) => {
      //   if (socketId !== socket.id) {
      //       editors[socketId].setCursor(cursor);
      //   }
      // });


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
