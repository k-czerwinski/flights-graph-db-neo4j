import axios from "axios";

const deleteRoute = async (
  source_IATA: string,
  destination_IATA: string,
  airline_code: string
) => {
  try {
    await axios.delete(
      `http://127.0.0.1:5000/route?source_IATA=${source_IATA}&destination_IATA=${destination_IATA}&airline_code=${airline_code}`
    );
  } catch (error) {
    console.error("Error deleting route:", error);
  }
};

export default deleteRoute;
