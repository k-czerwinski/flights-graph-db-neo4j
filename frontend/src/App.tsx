import React, { useEffect, useState } from "react";
import AddAirport from "./AddAirport";
import AddRoute from "./AddRoute";
import AirportsTable from "./AirportsTable";
import RoutesTable from "./RoutesTable";
import MultiStopRoutesTable from "./IndirectRoutes";

const App = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Flight Network System</h1>
      <AddAirport />
      <AddRoute />
      <AirportsTable />
      <RoutesTable />
      <MultiStopRoutesTable />
    </div>
  );
};

export default App;
