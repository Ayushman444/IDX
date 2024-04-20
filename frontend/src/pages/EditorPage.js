// EditorPage.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import toast from 'react-hot-toast';
import { Box, HStack } from "@chakra-ui/react";
import { CodeEditor } from "../components/ide/Editor";
import { useParams } from 'react-router-dom';
import { CODE_SNIPPETS } from "../Constants";
import { initSocket } from "../Socket";
import { EditorContext, InputContext } from "../context/EditorContext";
import { SideBar } from "../components/ide/SideBar";

export const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef("");
  const languageRef = useRef("");
  const [clients, setClients] = useState([]);
  const { roomId } = useParams();
  const [theme, setTheme] = useState("dark");

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
  const editorContext  = useContext(EditorContext);
  const inputContext = useContext(InputContext);
  const [input, setInput] = useState("input value");
  const [editor, setEditor] = useState(codeRef);

  useEffect(() => {
    setInput(inputContext);
  }, [inputContext]);
  // console.log(editorContext,inputContext);
  // console.log(codeRef);
  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <EditorContext.Provider value={editor}>
      <InputContext.Provider value={input}>
      <div className={`h-[100vh] w-[100vw] flex bg-white flex-row justify-center items-center relative ${theme === "dark" ? "dark-theme" : "light-theme"}`}>
    <input type="checkbox" className="toggle absolute top-2 right-10" onChange={handleThemeToggle} checked={theme === "light"} />
    <SideBar/>
    <Box minH="100vh" bg={`${theme === "dark" ? "gray.800":"gray.200"}`} color="gray.500" px={6} py={8}>
      <CodeEditor roomId={roomId} socket={socketRef} onCodeChange={(code) => { codeRef.current = code; }} onLanguageChange={(language) => { languageRef.current = language; }} setInput = {setInput} setEditor = {setEditor} theme={theme}/>
    </Box>
      
    
    </div>
      
      </InputContext.Provider>
    </EditorContext.Provider>
  );
};
