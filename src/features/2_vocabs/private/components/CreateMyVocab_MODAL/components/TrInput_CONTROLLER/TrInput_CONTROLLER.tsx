//
//
//

import { MAX_TRANSLATION_LENGTH } from "@/src/constants/globalVars";
import TrInput_BLOCK from "@/src/features/2_vocabs/components/Vocab_MODAL/components/TrInput_BLOCK/TrInput_BLOCK";
import { Control, Controller } from "react-hook-form";
import { CreateMyVocabData_PROPS } from "../../CreateMyVocab_MODAL";
import { TranslationCreation_PROPS } from "@/src/db/models";

interface TrInputController_PROPS {
  tr: TranslationCreation_PROPS;
  diff: 1 | 2 | 3;
  index: number;
  control: Control<CreateMyVocabData_PROPS, any>;
  OPEN_highlights: (tr: TranslationCreation_PROPS) => void;
}

export default function TrInput_CONTROLLER({
  tr,
  diff,
  index,
  control,
  OPEN_highlights,
}: TrInputController_PROPS) {
  return (
    <Controller
      control={control}
      name={`translations.${index}.text`}
      rules={{
        required: {
          value: true,
          message: "Translations can't be empty",
        },
        maxLength: {
          value: MAX_TRANSLATION_LENGTH,
          message: `Translations can have ${MAX_TRANSLATION_LENGTH} letters at most`,
        },
      }}
      render={({
        field: { onChange },
        fieldState: { error },
        formState: { isSubmitted },
      }) => {
        return (
          <TrInput_BLOCK
            {...{ tr, diff, error, isSubmitted, OPEN_highlights, onChange }}
          />
        );
      }}
    />
  );
}
