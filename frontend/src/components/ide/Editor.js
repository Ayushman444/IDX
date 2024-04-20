import React, { useEffect, useState } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { Input } from "./Input";
import { Output } from "./Output";
import { LanguageSelector } from "./LanguageSelector";
import { CODE_SNIPPETS } from "../../Constants";
import { useRef } from "react";


export const CodeEditor = ({ roomId, socket, onCodeChange,onLanguageChange , setInput }) => {
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

  const onSelect = (newLanguage) => {
    setLanguage(newLanguage);
    onLanguageChange(newLanguage);
    setValue(CODE_SNIPPETS[newLanguage]);
    onCodeChange(CODE_SNIPPETS[newLanguage])
    if (socket.current) {
      socket.current.emit('code_change', { roomId, code: CODE_SNIPPETS[newLanguage], language:newLanguage });
    }
  };

  const onChange = (newValue) => {
    setValue(newValue);
    onCodeChange(newValue);
    if (socket.current) {
      socket.current.emit('code_change', { roomId, code: newValue, language });
    }
    localStorage.setItem("code", newValue);
  };

  return (
    <Box h="100%" w = "100%">
      <HStack spacing={2}>
        <Box w="50%" >
          <LanguageSelector language={language} onSelect={onSelect} />
          <Editor
            options={{
              minimap: {
                enabled: false,
              },
            }}
            height="75vh"
            width="45vw"
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
