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

const httpGet = async (url: string) => {
    try {
        const response = await instance.get(url);
        return response.data;
    } catch (err) {
        console.error(`GET error:\n${err}`);
        throw err;
    }
}

const httpPost = async (url: string, data) => {
    try {
        const response = await instance.post(url, data);
        return response.data;
    } catch (err) {
        console.error(`POST error:\n${err}`);
        throw err;
    }
}

const httpDelete = async (url: string) => {
    try {
        const response = await instance.delete(url);
        return response.data;
    } catch (err) {
        console.error(`DELETE error:\n${err}`);
        throw err;
    }
}

const httpPatch = async (url: string, data) => {
    try {
        const response = await instance.patch(url, data);
        return response.data;
    } catch (err) {
        console.error(`POST error:\n${err}`);
        throw err;
    }
}

export { instance, httpGet , httpPost, httpDelete, httpPatch };