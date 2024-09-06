import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    axios
      .post("http://localhost:3000/forgot-password", { email })
      .then((response) => {
        toast({
          title: "Success",
          description: "Please check your email for further instructions.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Box
      maxW="md"
      borderWidth={1}
      borderRadius="lg"
      overflow="hidden"
      p={6}
      m="auto"
      mt={12}
      boxShadow="lg"
    >
      <VStack spacing={4} align="stretch">
        <Heading as="h3" size="lg" textAlign="center">Forgot Password</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <Button colorScheme="teal" type="submit" mt={4} width="full">
            Send Reset Instructions
          </Button>
        </form>
      </VStack>
    </Box>
  );
};

export default ForgotPassword;
