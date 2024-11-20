//
//
//

export type FlatlistError_PROPS = {
  value: boolean;
  msg: string;
};

// export type FormInputError_PROPS = {
//   input_NAME: string;
//   message: string;
// }[];

export type Error_TYPES =
  | "general"
  | "form_input"
  | "user_network"
  | "internal";

export type FormInputError_PROPS<T extends string> = {
  input_NAME: T; // Dynamic input names provided by the form
  message: string;
}[];

export type CreateError_PROPS<T extends string> = {
  IS_customError: true;
  message: string;
  type: Error_TYPES;
  details?: any;
  formInput_ERRORS?: FormInputError_PROPS<T>;
};

export type Error_PROPS<T extends string> = {
  message: string;
  type: Error_TYPES;
  formInput_ERRORS?: FormInputError_PROPS<T>;
};

export const CREATE_error = <T extends string>({
  message,
  type,
  details,
  formInput_ERRORS,
}: Omit<CreateError_PROPS<T>, "IS_customError">): CreateError_PROPS<T> => ({
  IS_customError: true, // Automatically added
  message,
  type,
  details,
  formInput_ERRORS,
});
