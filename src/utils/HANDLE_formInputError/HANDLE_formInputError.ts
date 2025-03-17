//
//
//
//

export function HANDLE_formInputError(error: any) {
  if (Object.hasOwn(error, "falsyForm_INPUTS")) throw error;
}
