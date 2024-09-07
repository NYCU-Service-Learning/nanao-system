import { SetMetadata, applyDecorators } from "@nestjs/common";

export const UserIdName = (paramsName: string) => SetMetadata('userId', paramsName);

export const SetFormMetaData = (formType: 'hurtForm' | 'weekForm' | 'yearForm', formIdParamsName: string) => applyDecorators(
    SetMetadata('formType', formType),
    SetMetadata('formIdName', formIdParamsName),
);