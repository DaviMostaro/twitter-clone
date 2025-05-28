import axios from "axios";

export const req = axios.create({
    baseURL: process.env.BASE_URL_API || "http://localhost:3001",
    headers: {
        'Content-Type': 'application/json'
    }
});