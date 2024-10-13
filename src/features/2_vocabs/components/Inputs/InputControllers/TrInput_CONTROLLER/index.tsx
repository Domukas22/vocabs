//
//
//

import { MAX_TRANSLATION_LENGTH } from "@/src/constants/globalVars";
import TrInput_BLOCK from "../../InputBlocks/TrInput_BLOCK";
import { Control, Controller } from "react-hook-form";
import { CreateMyVocabData_PROPS } from "../../../Modal/CreateMyVocab_MODAL/CreateMyVocab_MODAL";
import { tr_PROPS } from "@/src/db/props";
import { CreatePublicVocabData_PROPS } from "../../../Modal/CreatePublicVocab_MODAL/CreatePublicVocab_MODAL";

interface TrInputController_PROPS {
  tr: tr_PROPS;
  diff: 1 | 2 | 3 | undefined;
  index: number;
  control: Control<CreatePublicVocabData_PROPS, any>;
  OPEN_highlights: (tr: tr_PROPS) => void;
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
