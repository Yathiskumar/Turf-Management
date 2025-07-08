import axios from "axios";
 
 
const authAxios = axios.create({
    baseURL: "https://localhost:7124",
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});
 

export default authAxios;