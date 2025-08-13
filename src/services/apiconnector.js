import axios from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData = null, headers = {}, params = null) => {
    console.log("API CALL →", method, url);
console.log("→ Headers:", headers);

  return axiosInstance({
    method,
    url,
    data: bodyData,
    headers: {
      ...headers,
    },
    params,
  });
};
