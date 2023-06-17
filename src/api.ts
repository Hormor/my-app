import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: "https://conference-api.onrender.com",
});

instance.interceptors.response.use(
  (response) => {
    console.log(response);
    if (
      (response.config.method === "post" || response.config.method === "put") &&
      (response.status === 200 || response.status === 201)
    ) {
      toast.success("Success!!");
    }
    return response;
  },
  (error) => {
    if (error.response?.data?.message?.includes("duplicate key error")) {
      return Promise.reject("Value has been used");
    }
    return Promise.reject("An error occured");
  }
);

export default instance;
