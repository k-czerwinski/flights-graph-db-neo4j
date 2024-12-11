import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import config from "./Config";

const AddAirport = () => {
  const [airportData, setAirportData] = useState({
    latitude: "",
    longitude: "",
    altitude: "",
    city: "",
    country: "",
    IATA: "",
    ICAO: "",
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAirportData({ ...airportData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.apiUri}/airport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(airportData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Airport added successfully!");
        setAirportData({
          latitude: "",
          longitude: "",
          altitude: "",
          city: "",
          country: "",
          IATA: "",
          ICAO: "",
          name: "",
        });
      } else {
        alert(`Failed to add airport: ${data.message}`);
      }
    } catch (error) {
      console.error("Error adding airport:", error);
    }
  };

  return (
    <Box>
      <h2>Add Airport</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="IATA"
          name="IATA"
          value={airportData.IATA}
          onChange={handleChange}
          fullWidth
          required
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="ICAO"
          name="ICAO"
          value={airportData.ICAO}
          onChange={handleChange}
          fullWidth
          required
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Name"
          name="name"
          value={airportData.name}
          onChange={handleChange}
          fullWidth
          required
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="City"
          name="city"
          value={airportData.city}
          onChange={handleChange}
          fullWidth
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Country"
          name="country"
          value={airportData.country}
          onChange={handleChange}
          fullWidth
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Latitude"
          name="latitude"
          type="number"
          value={airportData.latitude}
          onChange={handleChange}
          fullWidth
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Longitude"
          name="longitude"
          type="number"
          value={airportData.longitude}
          onChange={handleChange}
          fullWidth
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Altitude"
          name="altitude"
          type="number"
          value={airportData.altitude}
          onChange={handleChange}
          fullWidth
          style={{ marginBottom: "10px" }}
        />
        <Button type="submit" variant="contained">
          Add Airport
        </Button>
      </form>
    </Box>
  );
};

export default AddAirport;
