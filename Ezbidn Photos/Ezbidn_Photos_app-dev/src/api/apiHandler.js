import axios from "axios";

const instance = axios.create({
	baseURL: "https://api.example.com",
	headers: { "Content-Type": "application/json" },
});

instance.interceptors.response.use(
	(response) => response,
	(error) => {
		return Promise.reject(error.response?.data?.message || "Something went wrong");
	}
);

export default instance;
