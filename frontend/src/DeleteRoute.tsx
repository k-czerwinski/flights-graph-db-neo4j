import api from "./AxiosConfig";

const deleteRoute = async (
  source_IATA: string,
  destination_IATA: string,
  airline_code: string
) => {
  try {
    await api.delete(
      `/route?source_IATA=${source_IATA}&destination_IATA=${destination_IATA}&airline_code=${airline_code}`
    );
  } catch (error) {
    console.error("Error deleting route:", error);
  }
};

export default deleteRoute;
