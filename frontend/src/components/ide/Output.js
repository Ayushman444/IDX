import { useState,useContext } from "react";
import { Box, Button, Text, useToast } from "@chakra-ui/react";
import { executeCode } from "./Executer";
import React from "react";
import { EditorContext, InputContext } from "../../context/EditorContext";
import { LanguageIds } from "../../Constants";

export const Output = ({ editorRef, language }) => {
  const toast = useToast();
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const editorContext  = useContext(EditorContext);
  const inputContext = useContext(InputContext);

  // console.log(editorContext,inputContext);
  // console.log(editorRef);
  const runCode = async () => {
    const sourceCode = editorContext;
    console.log(sourceCode);
    // console.log(sourceCode.current,"this is source code");  
    // console.log('def greet(name):\n\tprint("Hello, " + name + "!")\na=input("enter number");\ngreet(a);',"i need this");  

    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const output1 = await executeCode(LanguageIds[language], sourceCode
      , inputContext);
      
      setOutput(output1);
      // result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      // console.log(error);
      toast({
        title: "An error occurred.",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box w="100%" h="60%">
      <Text mb={2} fontSize="lg">
        Output
      </Text>
      <Button
        variant="outline"
        colorScheme="green"
        mb={4}
        isLoading={isLoading}
        onClick={runCode}
      >
        Run Code
      </Button>
      <Box
        height="45vh"
        p={2}
        color={isError ? "red.400" : ""}
        border="1px solid"
        borderRadius={4}
        borderColor={isError ? "red.500" : "#333"}
      >
        {output}
      </Box>
    </Box>
  )
}
