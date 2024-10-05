//
//
//

import { MAX_DESCRIPTION_LENGTH } from "@/src/constants/globalVars";
import DescriptionInput_BLOCK from "@/src/features/2_vocabs/components/Vocab_MODAL/components/DescriptionInput_BLOCK/DescriptionInput_BLOCK";
import { Control, Controller } from "react-hook-form";
import { CreateMyVocabData_PROPS } from "../../CreateMyVocab_MODAL";

interface DescriptionController_PROPS {
  control: Control<CreateMyVocabData_PROPS, any>;
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
