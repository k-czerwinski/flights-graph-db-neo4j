import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import config from "./Config";

const AddRoute = () => {
  const [routeData, setRouteData] = useState({
    sourceIATA: "",
    destinationIATA: "",
    airlineCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRouteData({ ...routeData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.apiUri}/route`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(routeData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Route added successfully!");
        setRouteData({
          sourceIATA: "",
          destinationIATA: "",
          airlineCode: "",
        });
      } else {
        alert(`Failed to add route: ${data.message}`);
      }
    } catch (error) {
      console.error("Error adding route:", error);
    }
  };

  return (
    <Box>
      <h2>Add Route</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Source Airport IATA"
          name="sourceIATA"
          value={routeData.sourceIATA}
          onChange={handleChange}
          fullWidth
          required
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Destination Airport IATA"
          name="destinationIATA"
          value={routeData.destinationIATA}
          onChange={handleChange}
          fullWidth
          required
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Airline Code"
          name="airlineCode"
          value={routeData.airlineCode}
          onChange={handleChange}
          fullWidth
          required
          style={{ marginBottom: "10px" }}
        />
        <Button type="submit" variant="contained">
          Add Route
        </Button>
      </form>
    </Box>
  );
};

export default AddRoute;
