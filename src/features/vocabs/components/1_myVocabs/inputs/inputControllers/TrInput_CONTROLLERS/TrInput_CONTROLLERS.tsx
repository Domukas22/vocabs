//
//
//

import { MAX_TRANSLATION_LENGTH } from "@/src/constants/globalVars";
import { TrInput_BLOCK } from "../../inputBlocks/TrInput_BLOCK/TrInput_BLOCK";
import { Control, Controller } from "react-hook-form";
import { tr_PROPS } from "@/src/props";
import Language_MODEL from "@/src/db/models/Language_MODEL";

interface TrInputController_PROPS {
  trs: tr_PROPS[] | undefined;
  diff: 1 | 2 | 3 | undefined;
  control: Control<CreatePublicVocabData_PROPS, any>;
  selected_LANGS: Language_MODEL[] | undefined;
  OPEN_highlights: (tr: tr_PROPS) => void;
}

export function TrInput_CONTROLLERS({
  trs,
  diff,
  control,
  selected_LANGS,
  OPEN_highlights,
}: TrInputController_PROPS) {
  return trs?.map((tr, index) => (
    <Controller
      key={tr?.lang_id + "controller"}
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
            key={tr?.lang_id + "langBlock"}
            lang={
              selected_LANGS
                ? selected_LANGS?.find((lang) => lang.lang_id === tr.lang_id)
                : undefined
            }
            {...{ tr, diff, error, isSubmitted, OPEN_highlights, onChange }}
          />
        );
      }}
    />
  ));
}
