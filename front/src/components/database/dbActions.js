import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress } from "@mui/material";
import { fetcher } from "@/app/api/fetcher";

export default function DatabaseActions({ selectedDatabase }) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (selectedDatabase && selectedDatabase !== "") {
      setLoading(true);
      const fetchTables = async () => {
        try {
          const result = await fetcher(`${apiURL}/database/${selectedDatabase}/recap`, "GET");
          if (result) {
            console.log(result);
            setTables(result.tables);
          }
        } catch (err) {
          console.log("Error fetching tables", err);
          setError("Failed to fetch tables");
        } finally {
          setLoading(false);
        }
      };

      fetchTables();
    }
  }, [selectedDatabase]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  const handleDump = async () => {
    try {
      const result = await fetcher(`${apiURL}/database/dump`, "POST", {
        dbName: selectedDatabase,
      });

      if (result && result.status === "ok") {
        const dumpData = atob(result.data);
        const blob = new Blob([dumpData], { type: "application/sql" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}-${date.getSeconds().toString().padStart(2, '0')}`;
        a.download = `${selectedDatabase}_dump_${formattedDate}.sql`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        throw new Error(result.error || "Failed to generate dump");
      }
    } catch (err) {
      console.log("Error fetching dump data", err);
      setError("Failed to generate dump");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = () => {
    // Implement restore functionality here
  };

  const handleBackup = () => {
    // Implement backup functionality here
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "#fafafa", padding: "2rem", borderRadius: "8px", boxShadow: 2 }}>
      <Typography variant="h4" gutterBottom>
        {selectedDatabase !== "" ? `Database: ${selectedDatabase}` : "Select a database first"}
      </Typography>

      {selectedDatabase && (
        <>
          <Box sx={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
            <Button variant="contained" color="primary" onClick={handleDump}>
              Dump
            </Button>
            <Button variant="contained" color="secondary" onClick={handleRestore}>
              Restore
            </Button>
            <Button variant="contained" color="success" onClick={handleBackup}>
              Backup
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Table Name</TableCell>
                  <TableCell align="right">Row Count</TableCell>
                  <TableCell align="right">Data Size</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tables?.map((table, index) => (
                  <TableRow key={table.name}>
                    <TableCell component="th" scope="row">
                      {table.name}
                    </TableCell>
                    <TableCell align="right">{table.rowCount}</TableCell>
                    <TableCell align="right">{table.dataSize}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}
