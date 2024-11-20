//
//
//

import { UseFormSetError, FieldValues, Path } from "react-hook-form";

type InputError<TFieldSchema extends FieldValues> = {
  input_NAME: Path<TFieldSchema>;
  message: string;
};

export function CREATE_manualFormErrorFromDbResponse<
  TFieldSchema extends FieldValues
>({
  formInput_ERRORS,
  SET_formError,
}: {
  formInput_ERRORS: InputError<TFieldSchema>[] | undefined;
  SET_formError: UseFormSetError<TFieldSchema>;
}) {
  if (!formInput_ERRORS?.length) return;

  formInput_ERRORS.forEach((err) => {
    SET_formError(err.input_NAME, {
      type: "manual",
      message: err.message,
    });
  });
}
