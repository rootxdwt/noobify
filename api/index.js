import axios from "axios";
export default axios.create({
  baseURL: "https://api.noobify.workers.dev",
});
console.log("[Axios]", "Initialized axios");
