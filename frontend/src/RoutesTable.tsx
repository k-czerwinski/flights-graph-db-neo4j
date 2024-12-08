import React, { useState } from "react";
import axios from "axios";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import deleteRoute from "./DeleteRoute";
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

interface Route {
  source_IATA: string;
  destination_IATA: string;
  airline_code: string;
}

const RoutesTable = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [source, setSource] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [deletingRoute, setDeletingRoute] = useState<Route | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDeleteRoute = (route: Route) => {
    setDeletingRoute(route);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingRoute) {
      await deleteRoute(
        deletingRoute.source_IATA,
        deletingRoute.destination_IATA,
        deletingRoute.airline_code
      );
      fetchRoutes();
    }
    setDialogOpen(false);
    setDeletingRoute(null);
  };

  const handleCancelDelete = () => {
    setDialogOpen(false);
    setDeletingRoute(null);
  };

  const fetchRoutes = async () => {
    try {
      const params = new URLSearchParams();
      if (source) params.append("source", source);
      if (destination) params.append("dest", destination);

      const response = await axios.get(
        `http://127.0.0.1:5000/routes?${params.toString()}`
      );
      setRoutes(response.data || []);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  return (
    <div>
      <h2>Routes</h2>
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
        <Button variant="contained" onClick={fetchRoutes}>
          Filter
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Source IATA</TableCell>
              <TableCell>Destination IATA</TableCell>
              <TableCell>Airline Code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {routes.map((route, index) => (
              <TableRow key={index}>
                <TableCell>{route.source_IATA}</TableCell>
                <TableCell>{route.destination_IATA}</TableCell>
                <TableCell>{route.airline_code}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDeleteRoute(route)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DeleteConfirmationDialog
        open={dialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        item="route"
      />
    </div>
  );
};

export default RoutesTable;
