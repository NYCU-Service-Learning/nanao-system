import { httpGet } from "./APIUtils";
import { API_URL } from "../config";

const fetchUserHealthAnalysis = async (userId: string) => {
    const response = await httpGet(`${API_URL}analysis/health/${userId}`);
    return response;
};

export { fetchUserHealthAnalysis };
