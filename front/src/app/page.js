"use client";

import { Button, Typography, Container, Box, Paper } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import Register from "@/components/register";
import Login from "@/components/login";
import { AuthProvider } from "./context/AuthContext";
import { AuthContext } from "./context/AuthContext";

export default function Home() {
  const [view, setView] = useState("login");
  const { user, loading, logout } = useContext(AuthContext);

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f0f4f8",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: 2,
          backgroundColor: "#fff",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          width: "100%",
        }}
      >

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 3,
          }}
        >
          <Button
            variant={view === "login" ? "contained" : "outlined"}
            onClick={() => setView("login")}
            sx={{
              borderRadius: "20px",
              marginRight: 1,
              padding: "8px 20px",
              width: "100px",
            }}
          >
            Login
          </Button>
          <Button
            variant={view === "register" ? "contained" : "outlined"}
            onClick={() => setView("register")}
            sx={{
              borderRadius: "20px",
              marginLeft: 1,
              padding: "8px 20px",
              width: "100px",
            }}
          >
            Register
          </Button>
        </Box>

        {view === "login" ? <Login /> : <Register />}
      </Paper>
    </Container>
  );
}
