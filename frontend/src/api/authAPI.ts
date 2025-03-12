import { API_URL } from "../config"
import { httpGet, httpPost } from "./APIUtils"

const getStatus = async () => {
    const data = await httpGet(`${API_URL}auth/status`);
    return data;
};

const requestLogout = async () => {
    await httpPost(`${API_URL}auth/logout`, {});
}

export { getStatus, requestLogout };
