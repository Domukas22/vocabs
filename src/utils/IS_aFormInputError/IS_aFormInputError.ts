//
//
//
//

export function IS_aFormInputError(error: any): boolean {
  return Object.hasOwn(error, "falsyForm_INPUTS");
}
