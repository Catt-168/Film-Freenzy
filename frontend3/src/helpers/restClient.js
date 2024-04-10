import axios from "axios";
import { SERVER } from "../constants";

const restClient = axios.create({
  baseURL: SERVER,
});

restClient.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("jwtToken")) || ""; // Adjust key based on your storage strategy
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default restClient;
