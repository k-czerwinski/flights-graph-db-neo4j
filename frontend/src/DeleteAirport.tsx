import axios from "axios";

const deleteAirport = async (airportIATA: string) => {
  try {
    await axios.delete(`http://127.0.0.1:5000/airport/${airportIATA}`);
  } catch (error) {
    console.error("Error deleting airport:", error);
  }
};

export default deleteAirport;
