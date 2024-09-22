import React, { useState } from "react";
import { Box, Button, TextField, MenuItem, Select, InputLabel, FormControl, Typography } from "@mui/material";
import { fetcher } from "@/app/api/fetcher";

const sqlCollations = [
  "utf8mb4_general_ci", 
  "utf8mb4_unicode_ci", 
  "latin1_swedish_ci"
];

const postgreCollations = [
  "en_US.utf8", 
  "de_DE.utf8", 
  "fr_FR.utf8"
];

export default function PostDatabase() {
  const authURL = process.env.NEXT_PUBLIC_AUTH_URL;
  const [dbName, setDbName] = useState("");
  const [dbType, setDbType] = useState("SQL");
  const [dbCollation, setDbCollation] = useState("utf8mb4_general_ci");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newDatabase = await fetcher(`${authURL}/database/new`, "POST", { dbName, dbType, dbCollation });
    console.log(newDatabase);
    
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: 400,
        margin: "0 auto",
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Create New Database
      </Typography>

      <TextField
        label="Database Name"
        variant="outlined"
        value={dbName}
        onChange={(e) => setDbName(e.target.value)}
        required
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel id="db-type-label">Database Type</InputLabel>
        <Select
          labelId="db-type-label"
          value={dbType}
          label="Database Type"
          onChange={(e) => {
            setDbType(e.target.value);
            setDbCollation(e.target.value === "SQL" ? "utf8mb4_general_ci" : "en_US.utf8");
          }}
        >
          <MenuItem value="SQL">SQL</MenuItem>
          <MenuItem value="PostgreSQL">PostgreSQL</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="db-collation-label">Collation</InputLabel>
        <Select
          labelId="db-collation-label"
          value={dbCollation}
          label="Collation"
          onChange={(e) => setDbCollation(e.target.value)}
        >
          {dbType === "SQL"
            ? sqlCollations.map((collation) => (
                <MenuItem key={collation} value={collation}>
                  {collation}
                </MenuItem>
              ))
            : postgreCollations.map((collation) => (
                <MenuItem key={collation} value={collation}>
                  {collation}
                </MenuItem>
              ))}
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" color="primary" fullWidth>
        Create Database
      </Button>
    </Box>
  );
}