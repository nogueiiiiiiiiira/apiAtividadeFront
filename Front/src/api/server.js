import axios from 'axios';

export const apiAtividade = axios.create({
    baseURL: "http://localhost:3001"
})