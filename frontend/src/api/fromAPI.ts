import { API_URL } from "../config";
import { httpDelete } from "./APIUtils";

const deleteHurtformById = async (formId: string) => {
    await httpDelete(`${API_URL}hurtform/${formId}`);
}

const deleteWeekformById = async (formId: string) => {
    await httpDelete(`${API_URL}weekform/${formId}`);
}

const deleteYearformById = async (formId: string) => {
    await httpDelete(`${API_URL}yearform/${formId}`);
}

export { deleteHurtformById, deleteWeekformById, deleteYearformById };