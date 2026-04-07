import { httpGet, httpPost } from "./APIUtils"

const getStatus = async () => {
    const data = await httpGet(`auth/status`);
    return data;
};

const requestLogout = async () => {
    await httpPost(`auth/logout`, {});
}

export { getStatus, requestLogout };
