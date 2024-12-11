import axios from "axios";
import api from "./AxiosConfig";

const deleteAirport = async (airportIATA: string) => {
  try {
    await api.delete(`/airport/${airportIATA}`);
  } catch (error) {
    console.error("Error deleting airport:", error);
  }
};

export default deleteAirport;
