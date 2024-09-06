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
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import ModalOtp from "./ModalOtp";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNeedOtp, setIsNeedOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    axios
      .post("http://localhost:3000/login", { email, password })
      .then((response) => {
        if (response.data.is_need_otp) {
          setIsNeedOtp(true);
        } else {
          localStorage.setItem("token", response.data.token);
          toast({
            title: "Login Success",
            description: "You have successfully logged in.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          setTimeout(() => {
            navigate("/"); // Redirect to the main page (App.jsx)
          }, 1000);
        }
      })
      .catch((err) => {
        const message = err.response ? err.response.data.message : "An unknown error occurred.";
        toast({
          title: "Error",
          position: "top-right",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <ModalOtp isOpen={isNeedOtp} onClose={() => setIsNeedOtp(false)} email={email} />

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
          <Heading as="h3" size="lg" textAlign="center">
            Login
          </Heading>
          <form onSubmit={handleSubmit}>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button
              colorScheme="teal"
              type="submit"
              mt={4}
              width="full"
              isLoading={loading} // Menambahkan loading state
            >
              Login
            </Button>
            <Button as={RouterLink} to="/forgot-password" variant="link" mt={4}>
              Forgot Password?
            </Button>
          </form>
        </VStack>
      </Box>
    </>
  );
};

export default LoginForm;
