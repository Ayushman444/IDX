// EditorPage.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Box, HStack } from "@chakra-ui/react";
import { CodeEditor } from "../components/ide/Editor";
import { useParams } from "react-router-dom";
import { CODE_SNIPPETS } from "../Constants";
import { initSocket } from "../Socket";
import { EditorContext, InputContext } from "../context/EditorContext";
import { SideBar } from "../components/ide/SideBar";
import { FaBurger } from "react-icons/fa6";

export const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const languageRef = useRef(null);
  const [users, setUsers] = useState([]);
  const { roomId } = useParams();
  const [theme, setTheme] = useState("dark");
  const username = localStorage.getItem("username");
  const [isAudioPanelOpen, setIsAudioPanelOpen] = useState(false);
  const [isSlidePanelOpen, setIsSlidePanelOpen] = useState(false);

  useEffect(() => {
    const initializeSocket = async () => {
      const socket = await initSocket();
      socketRef.current = socket;

      socket.emit("join", {
        roomId,
        username,
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
    
        const updatedUsers = clients.map(client => ({
            socketId: client.socketId,
            username: client.username,
            // Add any other properties you need from the client object
        }));
    
        setUsers(updatedUsers);
        console.log("users", updatedUsers);
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
        socketRef.current.off("joined");
        socketRef.current.off("disconnected");
      }
    };
  }, [roomId]);
  const editorContext = useContext(EditorContext);
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

  const handleAudioPanelToggle = () => {
    setIsAudioPanelOpen(!isAudioPanelOpen);
  };

  const handleSlidePanelToggle = () => {
    setIsSlidePanelOpen(!isSlidePanelOpen);
  };

  return (
    <EditorContext.Provider value={editor}>
      <InputContext.Provider value={input}>
        <div
          className={`h-[100vh] w-[100vw] flex bg-white flex-row justify-center items-center relative ${
            theme === "dark" ? "dark-theme" : "light-theme"
          }`}
        >
          <input
            type="checkbox"
            className="toggle absolute top-2 right-10"
            onChange={handleThemeToggle}
            checked={theme === "light"}
          />

          <div className="absolute flex flex-row top-2 right-[300px] ">
          <div className=" border border-rounded rounded-lg border-gray-500 p-2 mr-4">
            <p className="text-white">{username}</p>
          </div>

          <div>
            <button
              className="btn btn-accent "
              onClick={handleAudioPanelToggle}
            >
              Join Audio
            </button>
          </div>
          </div>
          

          <SideBar clients={users}/>
          <Box
            minH="100vh"
            bg={`${theme === "dark" ? "gray.800" : "gray.200"}`}
            color="gray.500"
            px={6}
            py={8}
          >
            <CodeEditor
              roomId={roomId}
              socket={socketRef}
              onCodeChange={(code) => {
                codeRef.current = code;
              }}
              onLanguageChange={(language) => {
                languageRef.current = language;
              }}
              setInput={setInput}
              setEditor={setEditor}
              theme={theme}
              username={username}
            />
          </Box>
          {isAudioPanelOpen && (
            <button>
              {" "}
              <FaBurger onClick={handleSlidePanelToggle} className="absolute top-3 right-2 " />{" "}
            </button>
          )}

          {isSlidePanelOpen && (
            <div className="fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg">
              {/* Your sliding panel content here */}
            </div>
          )}
        </div>
      </InputContext.Provider>
    </EditorContext.Provider>
  );
};
