import axios from "axios"

const axiosClient =  axios.create({
    baseURL: "https://codearena-r2du.onrender.com",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;


