//
//
//

import SEND_internalError from "./utils/SEND_internalError";

export type FlatlistError_PROPS = {
  value: boolean;
  msg: string;
};

export type FormInputError_PROPS = {
  input_NAME: string;
  message: string;
}[];

export type Error_PROPS = {
  message: string;
  type: "user" | "internal" | "user_internet";
  formInput_ERRORS?: FormInputError_PROPS;
};

export class App_ERROR extends Error {
  type: "internal" | "user" | "user_internet";
  formInput_ERRORS?: FormInputError_PROPS;

  constructor({
    message,
    type,
    formInput_ERRORS,
  }: {
    message: string;
    type: "internal" | "user" | "user_internet";
    formInput_ERRORS?: FormInputError_PROPS;
  }) {
    super(message);
    this.type = type;
    this.formInput_ERRORS = formInput_ERRORS;
  }
}
