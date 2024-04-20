import React, { useEffect, useState, useRef } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { Input } from "./Input";
import { Output } from "./Output";
import { LanguageSelector } from "./LanguageSelector";
import { CODE_SNIPPETS } from "../../Constants";
export const CodeEditor = ({ roomId, socket, onCodeChange, onLanguageChange, setInput, setEditor, theme, username }) => {
  const editorRef = useRef(null); // Initialize editorRef with null
  const inputRef = useRef(null);
  const [language, setLanguage] = useState("javascript");
  const [value, setValue] = useState(CODE_SNIPPETS[language]);
  const [cursorPosition, setCursorPosition] = useState({});
  const [usrnm, setUsrnm] = useState();
  const [showBox, setShowBox] = useState(false);

  useEffect(() => {
    if (socket.current) {
      socket.current.on('code_change', ({ code, language }) => {
        setValue(code);
        setLanguage(language);
      });
      socket.current.on('cursor_position', ({ cursorPosition, username }) => {
        setCursorPosition(cursorPosition);
        setUsrnm(username);
        console.log('username',username);
        console.log('position',cursorPosition);
      });
    }

    return () => {
      socket.current.off('code_change');
      socket.current.off('cursor_position');
    };
  }, [socket.current]);

  const handleEditorDidMount = (editor, _monaco) => {
    editorRef.current = editor; // Set editorRef to the editor instance
    editor.focus();
  };
  const [codeByLanguage, setCodeByLanguage] = useState({});
  useEffect(() => {
    const savedCode = localStorage.getItem('codeByLanguage');
    if (savedCode) {
      setCodeByLanguage(JSON.parse(savedCode));
    }
  }, []);
  useEffect(() => {
    // Save code to localStorage whenever it changes
    localStorage.setItem('codeByLanguage', JSON.stringify(codeByLanguage));
  }, [codeByLanguage]);

  const onChange = (newValue, event) => {
  // Update the code for the current language whenever the code changes
  setCodeByLanguage({
    ...codeByLanguage,
    [language]: newValue,
  });
  setEditor(newValue);
  setValue(newValue);
  onCodeChange(newValue);

  if (socket.current) {
    socket.current.emit('code_change', { roomId, code: newValue, language });
  }

  localStorage.setItem("code", newValue);
    const editor = editorRef.current;
    console.log('editor',editor)
    if (editor) {
      const cursorPos = editor.getPosition();
      console.log('CursorPos',cursorPos)
      if (cursorPos) {
        if (socket.current) {
          socket.current.emit('cursor_position', { roomId, cursorPosition: cursorPos, username });
        }
      }
    }
  };

  const onSelect = (newLanguage) => {
    // Save the current code before changing languages
    const newCodeByLanguage = {
      ...codeByLanguage,
      [language]: value,
    };
    localStorage.clear();
    setCodeByLanguage(newCodeByLanguage);
    localStorage.setItem('codeByLanguage', JSON.stringify(newCodeByLanguage));
  
    // Load the code for the new language, or default code if none exists
    const newCode = codeByLanguage[newLanguage] || CODE_SNIPPETS[newLanguage];
    setValue(newCode);
    onCodeChange(newCode);
  
    setLanguage(newLanguage);
    onLanguageChange(newLanguage);
  
    if (socket.current) {
      socket.current.emit('code_change', { roomId, code: newCode, language: newLanguage });
    }
  };

  const onFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setValue(e.target.result);
      setEditor(e.target.result);
    };

    reader.readAsText(file);
  };

  useEffect(() => {
    // Set showBox to true when cursorPosition is updated
    setShowBox(true);
  
    // Set a timer to hide the box after 500ms
    const timer = setTimeout(() => {
      setShowBox(false);
    }, 2000);
  
    // Clear the timer when the component unmounts or cursorPosition is updated
    return () => clearTimeout(timer);
  }, [cursorPosition]);
  

  return (
    <Box h="100%" w="100%" >
      <input type="file" onChange={onFileUpload} />
      <HStack spacing={2}>
        <Box w="50%" >
          <LanguageSelector language={language} onSelect={onSelect} />

          <Editor
            className="border border-gray-500 rounded-sm"
            options={{
              minimap: {
                enabled: false,
              },
            }}
            height="75vh"
            width="45vw"
            theme={theme === "dark" ? "vs-dark" : "vs"}
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={handleEditorDidMount}
            value={value}
            onChange={onChange}
          />
        </Box>
        <Box w="50%" >
          <VStack>
            <Output editorRef={editorRef} language={language} inputRef={inputRef} theme={theme} />
            <Input inputRef={inputRef} setInput={setInput} />
          </VStack>
        </Box>
      </HStack>
      {showBox && cursorPosition && username!=usrnm && (
  <Box
    position="absolute"
    top={cursorPosition.lineNumber * 20 + 135 + "px"}
    left={cursorPosition.column * 8 + 140 + "px"}
    zIndex="50"
    fontWeight="bold"
    className="flex bg-red-900 h-6 text-white items-center"
    borderRadius="md"
    px={2} // Horizontal padding
    py={1} // Vertical padding
  >
    {usrnm}
  </Box>
)}
    </Box>
  );
};
