import { httpGet, httpPatch } from "./APIUtils";
import { API_URL } from "../config";

const getUserDetailById = async (id: string) => {
    const userData = await httpGet(`${API_URL}user-detail/${id}`);
    return userData;
}

const patchUserDetailById = async (id: string, data) => {
    await httpPatch(`${API_URL}user-detail/${id}`, data);
}

export { getUserDetailById, patchUserDetailById };