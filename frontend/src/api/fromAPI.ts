import { httpDelete } from "./APIUtils";

const deleteHurtformById = async (formId: string) => {
    await httpDelete(`/hurtform/${formId}`);
}

const deleteWeekformById = async (formId: string) => {
    await httpDelete(`/weekform/${formId}`);
}

const deleteYearformById = async (formId: string) => {
    await httpDelete(`/yearform/${formId}`);
}

export { deleteHurtformById, deleteWeekformById, deleteYearformById };
