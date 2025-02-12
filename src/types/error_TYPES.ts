//
//
//

interface GeneralError_PROPS {
  message: string;
  function_NAME: string;
  user_MSG?: string;
  code?: string;
  details?: string; // Added details to match PostgrestError
  hint?: string; // Added hint to match PostgrestError
  other?: any;
  errorToSpread?: GeneralError_PROPS;
}

/**
 * Global error handler of the app.
 * 
 * @param {string} function_NAME - Name of the function that threw the error.
 * @param {string} message - Internal error message.
 * @param {string} user_MSG - Error message that the user will see.
 * @param {object} other - Any additional infos that don't fit into the 'General_ERROR' props.
 * @param {General_ERROR} errorToSpread - The entire error object to avoid writing everything out.
 * @param {string} code - Error code from Postgress errors.
 * @param {string} details - Error details from Postgress errors.
 * @param {string} hint - Error hint from Postgress errors.

 */
export class General_ERROR extends Error {
  function_NAME: string;
  message: string;
  user_MSG?: string;
  code?: string;
  details?: string;
  hint?: string;
  other?: any;
  errorToSpread?: GeneralError_PROPS;

  constructor(error: GeneralError_PROPS) {
    const {
      function_NAME,
      user_MSG,
      message,
      code,
      details,
      hint,
      other,
      errorToSpread,
    } = error;

    super(message || errorToSpread?.message || "No error message provided");
    this.message =
      message || errorToSpread?.message || "No error message provided";

    this.name = "General_ERROR";

    // Handling user_MSG logic
    this.user_MSG = user_MSG
      ? user_MSG
      : this.message?.includes("Network request failed")
      ? "There seems to be an issue with your internet connection"
      : errorToSpread?.user_MSG || "An unexpected error occurred";

    // Handle function_NAME
    this.function_NAME =
      function_NAME ||
      errorToSpread?.function_NAME ||
      "function_NAME not provided";

    // Assign the 'code' property if provided
    this.code = code || errorToSpread?.code || "UNKNOWN_ERROR";

    // Assign 'details' and 'hint' if available
    this.details = details || errorToSpread?.details;
    this.hint = hint || errorToSpread?.hint;

    // Assign the 'other' property for extra data
    this.other = other || errorToSpread?.other;

    // Attach the stack trace if it exists
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, General_ERROR);
    }
  }
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

type FormInputError_PROPS<validInput_NAMES extends string = string> = {
  input_NAME: validInput_NAMES; // Dynamic input names from the form
  message: string; // Error message for this particular form input
};

// ------

interface FormError_PROPS<validInput_NAMES extends string = string> {
  user_MSG: string;
  falsyForm_INPUTS: [
    FormInputError_PROPS<validInput_NAMES>, // At least one falsy input required
    ...FormInputError_PROPS<validInput_NAMES>[]
  ];
}

export class FormInput_ERROR<
  validInput_NAMES extends string = string
> extends Error {
  user_MSG: string;
  falsyForm_INPUTS: [
    FormInputError_PROPS<validInput_NAMES>,
    ...FormInputError_PROPS<validInput_NAMES>[]
  ];

  constructor(error: FormError_PROPS<validInput_NAMES>) {
    super(error.user_MSG);
    this.name = "FormInput_ERROR";
    this.user_MSG = error.user_MSG;
    this.falsyForm_INPUTS = error.falsyForm_INPUTS;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FormInput_ERROR);
    }
  }
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

export type Error_PROPS<validInput_NAMES extends string = string> =
  | {
      error_TYPE: "general";
      user_MSG: string;
      message: string;
      function_NAME: string;

      error_DETAILS?: Object; // --
    }
  | {
      error_TYPE: "form_input";
      user_MSG: string;
      falsyForm_INPUTS: [
        FormInputError_PROPS<validInput_NAMES>, // At least one falsy input required
        ...FormInputError_PROPS<validInput_NAMES>[]
      ];
    };
