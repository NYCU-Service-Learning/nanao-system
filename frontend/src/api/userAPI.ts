import { get } from "./APIUtils";
import { API_URL } from "../config";

const fetchIdByUsername = async (username: string): Promise<string> => {
    const id = await get(`${API_URL}user/find/${username}`);
    return id;
};

export { fetchIdByUsername };