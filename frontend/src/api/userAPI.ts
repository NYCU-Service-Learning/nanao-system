import { httpGet, httpDelete, httpPatch, httpPost } from "./APIUtils";
import { API_URL } from "../config";

const getIdByUsername = async (username: string): Promise<string> => {
    const id = await httpGet(`/user/find/${username}`);
    return String(id);
};

const getUserById = async (id: string | number) => {
    const user = await httpGet(`/user/${id}`);
    return user;
}

const getAllUsers = async () => {
    const users = await httpGet(`/user`);
    return users;
};

const deleteUserById = async (id: string) => {
    await httpDelete(`/user/${id}`);
};

const patchUserById = async (id: string, data) => {
    await httpPatch(`/user/${id}`, data);
};

const createNewUser = async (data) => {
    await httpPost(`/user/`, data);
};

export { getIdByUsername, getAllUsers, deleteUserById, patchUserById, createNewUser,  getUserById };
