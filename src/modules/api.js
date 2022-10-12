import axios from "axios";

const url = "https://za-halyavoi.ru/api/";

export const api = axios.create({
  baseURL: url,
});

export default api;
