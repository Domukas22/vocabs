//
//
//

import { MAX_DESCRIPTION_LENGTH } from "@/src/constants/globalVars";
import DescriptionInput_BLOCK from "../../InputBlocks/DescriptionInput_BLOCK";
import { Control, Controller } from "react-hook-form";
import { CreateMyVocabData_PROPS } from "../../../Modal/CreateMyVocab_MODAL/CreateMyVocab_MODAL";
import { CreatePublicVocabData_PROPS } from "../../../Modal/CreatePublicVocab_MODAL/CreatePublicVocab_MODAL";

interface DescriptionController_PROPS {
  control: Control<CreatePublicVocabData_PROPS, any>;
}

export default function Description_CONTROLER({
  control,
}: DescriptionController_PROPS) {
  return (
    <Controller
      control={control}
      name="description"
      rules={{
        maxLength: {
          value: MAX_DESCRIPTION_LENGTH || 200,
          message: `Descriptions can have ${
            MAX_DESCRIPTION_LENGTH || 200
          } letters at most`,
        },
      }}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState: { isSubmitted },
      }) => (
        <DescriptionInput_BLOCK {...{ value, onChange, error, isSubmitted }} />
      )}
    />
  );
}
