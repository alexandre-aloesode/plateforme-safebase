"use client";
import { Button, Container, Box, Modal, List, ListItem, ListItemText, Divider, IconButton } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import { useRouter } from 'next/navigation'; // Utilisez 'next/navigation' pour la redirection dans Next.js
import { fetcher } from "../api/fetcher";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PostDatabase from "@/components/database/postDatabase";
import DatabaseActions from "@/components/database/dbActions";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const [databases, setDatabases] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState("");
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const authURL = process.env.NEXT_PUBLIC_AUTH_URL;

  const handleModal = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const fetchDatabases = async () => {
    try {
      const result = await fetcher(`${authURL}/database/get`, "GET");

      if (result && result.data !== "User has no database yet") {
        setDatabases(result.data);
      }
    } catch (err) {
      console.log("resulterr", err);
      throw err;
    }
  };

  useEffect(() => {
      fetchDatabases();
  }, []);

  return (
    <Container component="main" sx={{ display: "flex", height: "100vh", border: "solid 1px black", position: "relative" }}>
      <Box
        sx={{
          width: "20%",
          bgcolor: "#f5f5f5",
          padding: "1rem",
          borderRight: "1px solid #ddd",
        }}
      >
        <h2>My Databases</h2>
        <List>
          {databases?.map((database, index) => (
            <ListItem button key={index} onClick={() => setSelectedDatabase(database)}>
              <ListItemText primary={database} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Button variant="contained" color="primary" onClick={handleModal} startIcon={<AddCircleIcon />} sx={{ marginTop: "1rem", width: "100%" }}>
          Add Database
        </Button>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          padding: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#fafafa",
        }}
      >
        <DatabaseActions selectedDatabase={selectedDatabase} />
      </Box>

      <Modal open={open} onClose={handleModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <PostDatabase />
        </Box>
      </Modal>

      <IconButton
        onClick={handleLogout}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1000, // Assure que le bouton soit au-dessus des autres éléments
        }}
      >
        <LogoutIcon />
      </IconButton>
    </Container>
  );
}
