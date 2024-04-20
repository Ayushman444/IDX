import React, { useEffect, useState } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { Input } from "./Input";
import { Output } from "./Output";
import { LanguageSelector } from "./LanguageSelector";
import { CODE_SNIPPETS } from "../../Constants";
import { useRef } from "react";
// import { CODE_SNIPPETS } from "../../Constants";


export const CodeEditor = ({ roomId, socket, onCodeChange,onLanguageChange , setInput , setEditor}) => {
  const editorRef = useRef("");
  const inputRef = useRef("");
  const [language, setLanguage] = useState("javascript");
  const [value, setValue] = useState(CODE_SNIPPETS[language]);

  useEffect(() => {
    if (socket.current) {
        socket.current.on('code_change', ({ code,language }) => {
            // console.log(editorRef.current.getValue()); 
            setValue(code);
            setLanguage(language);
        });
    }

    return () => {
        socket.current.off('code_change');
    };
}, [socket.current]);

  const onMount = (editor) => {
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
  const onFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setValue(e.target.result);
      setEditor(e.target.result);
      // editorRef = (e.target.result);
    };

    reader.readAsText(file);
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

const onChange = (newValue) => {
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
};

  return (
    <Box>
      <input type="file" onChange={onFileUpload} />
      <HStack spacing={4}>
        <Box w="50%" >
          <LanguageSelector language={language} onSelect={onSelect} />
          <Editor
            options={{
              minimap: {
                enabled: false,
              },
            }}
            height="75vh"
            theme="vs-dark"
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={onChange}
          />
        </Box>
        <Box w="50%">
          <VStack>
            
            <Output editorRef={editorRef} language={language} inputRef={inputRef} />
            
            
            <Input inputRef={inputRef} setInput={setInput}/>
          </VStack>
        </Box>
        
      </HStack>
    </Box>
  );
};
