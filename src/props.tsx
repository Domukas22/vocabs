//
//
//

export interface ListCreation_PROPS {
  user_id: string;
  name: string;
  description: string;
}

export interface tr_PROPS {
  lang_id: string;
  text: string;
  highlights: number[];
}

export type List_TYPES = "private" | "public" | "shared" | "draft";

export type Error_TYPES =
  | "general"
  | "form_input"
  | "user_network"
  | "internal"
  | "unknown";

export type FormInputError_PROPS<validInput_NAMES extends string = string> = {
  input_NAME: validInput_NAMES; // Dynamic input names provided by the form
  message: string;
};

export type Error_PROPS<validInput_NAMES extends string = string> =
  | {
      error_TYPE: "general" | "user_network";
      user_MSG: string;
      function_NAME: string;

      internal_MSG?: never; // --
      error_DETAILS?: never; // --
      falsyForm_INPUTS?: never; // --
    }
  | {
      error_TYPE: "internal" | "unknown";
      user_MSG: string;
      internal_MSG: string;
      function_NAME: string;

      error_DETAILS?: Object; // optional
      falsyForm_INPUTS?: never; // --
    }
  | {
      error_TYPE: "form_input";
      user_MSG: string;
      function_NAME: string;
      falsyForm_INPUTS: [
        FormInputError_PROPS<validInput_NAMES>, // At least one falsy input required
        ...FormInputError_PROPS<validInput_NAMES>[]
      ];

      internal_MSG?: never; // --
      error_DETAILS?: never; // --
    };
