import axios from "axios";
import { APIReadKey } from "../constant";

const locForecastEndpoint = (params) =>
  `http://api.weatherapi.com/v1/forecast.json?key=${APIReadKey}&q=${params.city}&days=${params.days}&aqi=no&alerts=no`;

const searchLocEndpoint = (params) =>
  `http://api.weatherapi.com/v1/search.json?key=${APIReadKey}&q=${params.city}`;

const apiCall = async (endpoint) => {
  const options = {
    method: "GET",
    url: endpoint,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchLocForecast = (params) => {
  const endpointUrl = locForecastEndpoint(params);
  return apiCall(endpointUrl);
};

export const fetchSearchLocForecast = (params) => {
  const endpointUrl = searchLocEndpoint(params);
  return apiCall(endpointUrl);
};
