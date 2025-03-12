import axios from 'axios';
import { API_URL } from '../config';

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    timeout: 10 * 1000,
});

const get = async (url: string) => {
    try {
        const response = await instance.get(url);
        return response.data;
    } catch (err) {
        console.error(`GET error:\n${err}`);
        throw err;
    }
}

const post = async (url: string, data) => {
    try {
        const response = await instance.post(url,data);
        return response.data;
    } catch (err) {
        console.error(`POST error:\n${err}`);
        throw err;
    }
}

export { instance, get, post };