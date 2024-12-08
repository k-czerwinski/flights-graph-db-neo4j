import React, { useState } from "react";
import axios from "axios";
import AirportVisualization from "./AirportVisualization";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import deleteAirport from "./DeleteAirport";

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
  Box,
} from "@mui/material";

interface Airport {
  IATA: string;
  ICAO: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  altitude: number;
}

const AirportsTable = () => {
  const [selectedAirport, setSelectedAirport] = useState<string | null>(null);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [country, setCountry] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const fetchAirports = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/airports?country=${country}`
      );
      setAirports(response.data || []);
    } catch (error) {
      console.error("Error fetching airports:", error);
    }
  };

  const handleDeleteAirport = (airportIATA: string) => {
    setDeletingItemId(airportIATA);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingItemId) {
      await deleteAirport(deletingItemId);
      setAirports(
        airports.filter((airport) => airport.IATA !== deletingItemId)
      );
    }
    setDialogOpen(false);
    setDeletingItemId(null);
  };

  const handleCancelDelete = () => {
    setDialogOpen(false);
    setDeletingItemId(null);
  };

  const handleVisualize = (airportIATA: string) => {
    setSelectedAirport(selectedAirport === airportIATA ? null : airportIATA);
  };

  return (
    <div>
      <h2>Airports</h2>
      <div style={{ marginBottom: "20px" }}>
        <TextField
          label="Country"
          variant="outlined"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <Button variant="contained" onClick={fetchAirports}>
          Filter
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>IATA</TableCell>
              <TableCell>ICAO</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Latitude</TableCell>
              <TableCell>Longitude</TableCell>
              <TableCell>Altitude</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {airports.map((airport) => (
              <React.Fragment key={airport.IATA}>
                <TableRow>
                  <TableCell>{airport.IATA}</TableCell>
                  <TableCell>{airport.ICAO}</TableCell>
                  <TableCell>{airport.name}</TableCell>
                  <TableCell>{airport.city}</TableCell>
                  <TableCell>{airport.country}</TableCell>
                  <TableCell>{airport.latitude}</TableCell>
                  <TableCell>{airport.longitude}</TableCell>
                  <TableCell>{airport.altitude}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleVisualize(airport.IATA)}
                    >
                      {selectedAirport === airport.IATA
                        ? "Hide Visualization"
                        : "Routes Visualization"}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleDeleteAirport(airport.IATA)}
                    >
                      Delete with all routes
                    </Button>
                  </TableCell>
                </TableRow>

                {selectedAirport === airport.IATA && (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <div style={{ width: "100%", height: "800px" }}>
                        <AirportVisualization airportIATA={airport.IATA} />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DeleteConfirmationDialog
        open={dialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        item={"airport and its routes"}
      />
    </div>
  );
};

export default AirportsTable;
