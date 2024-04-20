import React, { useRef, useEffect,useState,createContext } from "react";
import { Box } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { Text } from "@chakra-ui/react";

export const InputValueContext = createContext();
export const InputValueProvider = ({ children }) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <InputValueContext.Provider value={{ inputValue, setInputValue }}>
      {children}
    </InputValueContext.Provider>
  );
};

export const Input = ({ inputRef ,setInput}) => {
  // const inputRef = useRef();

  const onMount = (editor) => {
    inputRef.current = editor;
    editor.focus();
  };

  return (
    <Box h="30%" w="100%">
      <Text mb={2} fontSize="lg">
        Input
      </Text>
      <Editor
        options={{
          minimap: {
            enabled: false,
          },
        }}
        height="30vh"
        theme="vs-dark"
        defaultLanguage="plaintext"
        defaultValue=""
        onMount={onMount}
        onChange={value => setInput(value)}
      />
    </Box>
  );
};
