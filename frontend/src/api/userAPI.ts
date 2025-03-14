import { httpGet, httpDelete, httpPatch, httpPost } from "./APIUtils";
import { API_URL } from "../config";

const getIdByUsername = async (username: string): Promise<string> => {
    const id = await httpGet(`${API_URL}user/find/${username}`);
    return id;
};

const getUserById = async (id: string | number) => {
    const user = await httpGet(`${API_URL}user/${id}`);
    return user;
}

const getAllUsers = async () => {
    const users = await httpGet(`${API_URL}user`);
    return users;
};

const deleteUserById = async (id: string) => {
    await httpDelete(`${API_URL}user/${id}`);
};

const patchUserById = async (id: string, data) => {
    await httpPatch(`${API_URL}user/${id}`, data);
};

const createNewUser = async (data) => {
    await httpPost(`${API_URL}user/`, data);
};

export { getIdByUsername, getAllUsers, deleteUserById, patchUserById, createNewUser,  getUserById };