import axios from "axios";

const api = axios.create({
  baseURL: "https://flightmanagerbackend.azurewebsites.net",
});

export default api;
