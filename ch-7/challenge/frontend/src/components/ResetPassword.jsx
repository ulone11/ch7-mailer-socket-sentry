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
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const otp = searchParams.get("otp");
  const [newPassword, setNewPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate(); // Use navigate to redirect

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPassword) {
      toast({
        title: "Error",
        description: "Please enter a new password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Build query string with OTP
    const queryParams = new URLSearchParams({ otp }).toString();
    
    axios
      .post(`http://localhost:3000/reset-password?${queryParams}`, { newPass: newPassword })
      .then((response) => {
        toast({
          title: "Success",
          description: "Password has been reset successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Redirect to login form
        setTimeout(() => {
          navigate("/login"); // Redirect to login page
        }, 1000);
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.response?.data?.error || "An error occurred",
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
        <Heading as="h3" size="lg" textAlign="center">Reset Password</Heading>
        <form onSubmit={handleSubmit}>
          <FormControl id="new-password" isRequired>
            <FormLabel>New Password</FormLabel>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FormControl>
          <Button colorScheme="teal" type="submit" mt={4} width="full">
            Reset Password
          </Button>
        </form>
      </VStack>
    </Box>
  );
};

export default ResetPassword;
