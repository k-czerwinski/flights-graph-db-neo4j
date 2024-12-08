import React, { useState, useEffect } from "react";
import axios from "axios";
import { Network } from "vis-network";

const AirportVisualization = ({ airportIATA }: { airportIATA: string }) => {
  const [graphData, setGraphData] = useState<any>(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/visualise-routes-from/airport/${airportIATA}`
        );
        setGraphData(response.data);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    fetchGraphData();
  }, [airportIATA]);

  useEffect(() => {
    if (graphData) {
      const nodes = graphData.nodes.map((node: any) => ({
        id: node.id,
        label: node.id,
        x: node.lon * 500,
        y: -node.lat * 500,
        physics: false,
      }));

      const edges = graphData.edges.map((edge: any) => ({
        from: edge.from,
        to: edge.to,
        label: `${edge.airline}`,
      }));

      const data = { nodes, edges };

      const container = document.getElementById("graph");
      new Network(container, data, {
        edges: {
          arrows: {
            to: { enabled: true, scaleFactor: 1 },
          },
        },
      });
    }
  }, [graphData]);

  return <div id="graph" style={{ height: "750px" }} />;
};

export default AirportVisualization;
