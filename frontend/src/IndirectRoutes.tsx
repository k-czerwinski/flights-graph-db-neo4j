import React, { useState } from "react";
import api from "./AxiosConfig";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";

interface MultiStopRoute {
  airports: string[];
  airlines: string[];
}

const MultiStopRoutesTable = () => {
  const [multiStopRoutes, setMultiStopRoutes] = useState<MultiStopRoute[]>([]);
  const [source, setSource] = useState<string>("");
  const [destination, setDestination] = useState<string>("");

  const fetchMultiStopRoutes = async () => {
    try {
      const params = new URLSearchParams();
      if (source) params.append("source", source);
      if (destination) params.append("dest", destination);

      const response = await api.get(`/multi-stop-routes?${params.toString()}`);
      setMultiStopRoutes(response.data || []);
    } catch (error) {
      console.error("Error fetching multi-stop routes:", error);
    }
  };

  return (
    <div>
      <h2>Multi-Stop Routes</h2>
      <div style={{ marginBottom: "20px" }}>
        <TextField
          label="Source Airport IATA"
          variant="outlined"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <TextField
          label="Destination Airport IATA"
          variant="outlined"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <Button variant="contained" onClick={fetchMultiStopRoutes}>
          Search
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Path</TableCell>
              <TableCell>Airlines</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {multiStopRoutes.map((route, index) => (
              <TableRow key={index}>
                <TableCell>{route.airports.join(" → ")}</TableCell>
                <TableCell>{route.airlines.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MultiStopRoutesTable;
