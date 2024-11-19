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
  setError,
}: {
  formInput_ERRORS: InputError<TFieldSchema>[] | undefined;
  setError: UseFormSetError<TFieldSchema>;
}) {
  if (!formInput_ERRORS?.length) return;

  formInput_ERRORS.forEach((err) => {
    setError(err.input_NAME, {
      type: "manual",
      message: err.message,
    });
  });
}
