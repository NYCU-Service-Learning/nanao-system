import { httpGet, httpPatch } from "./APIUtils";

const getUserDetailById = async (id: string) => {
    const userData = await httpGet(`/user-detail/${id}`);
    return userData;
}

const patchUserDetailById = async (id: string, data) => {
    await httpPatch(`/user-detail/${id}`, data);
}

export { getUserDetailById, patchUserDetailById };
