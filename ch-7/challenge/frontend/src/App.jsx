import "./App.css";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import { Button } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ForgotPassword from "./components/ForgotPassword"; // Import halaman forgot password
import ResetPassword from "./components/ResetPassword"; // Import halaman reset password

function App() {
  const [socket, setSocket] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const { id_user } = decoded;

      const initSocket = io("http://localhost:3000", {
        query: { id_user },
      });

      setSocket(initSocket);

      initSocket.on("connect", () => {
        console.log("Connected to the server with socket ID:", initSocket.id);
      });

      initSocket.on("disconnect", () => {
        console.log("Disconnected from the server");
      });

      return () => {
        initSocket.disconnect();
      };
    }
  }, [token]);

  const handleTestEmit = () => {
    const decoded = jwtDecode(token);
    const { id_user } = decoded;

    socket.emit("new-notification", {
      message: "Hello, this is a test notification",
      recipientId: id_user
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect ke halaman login
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={
          token ? (
            <>
              <Navbar socket={socket} />
              <h1>Welcome to the Dashboard</h1>
              <Button colorScheme="teal" onClick={handleTestEmit}>Test Emit</Button>
              <Button colorScheme="red" onClick={handleLogout} mt={4}>Logout</Button>
            </>
          ) : (
            <LoginForm />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;
