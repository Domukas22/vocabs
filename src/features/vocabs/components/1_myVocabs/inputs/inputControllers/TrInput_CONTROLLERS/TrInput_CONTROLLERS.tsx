//
//
//

import { MAX_TRANSLATION_LENGTH } from "@/src/constants/globalVars";
import { TrInput_BLOCK } from "../../inputBlocks/TrInput_BLOCK/TrInput_BLOCK";
import { Control, Controller } from "react-hook-form";
import Language_MODEL from "@/src/db/models/Language_MODEL";
import { CreateMyVocabData_PROPS } from "../../../../../../../features_new/vocabs/components/modals/CreateMyVocab_MODAL/CreateMyVocab_MODAL";
import { Lang_TYPE } from "@/src/features_new/languages/types";
import { VocabTr_TYPE } from "@/src/features_new/vocabs/types";
import { USE_getTargetLangs } from "@/src/features_new/languages/hooks";

interface TrInputController_PROPS {
  trs: VocabTr_TYPE[] | undefined;
  diff: 1 | 2 | 3 | undefined;
  control: Control<CreateMyVocabData_PROPS, any>;
  OPEN_highlights: (tr: VocabTr_TYPE) => void;
}

export function TrInput_CONTROLLERS({
  trs,
  diff,
  control,

  OPEN_highlights,
}: TrInputController_PROPS) {
  const { target_LANGS: target_LANGS } = USE_getTargetLangs({
    targetLang_IDS: trs?.map((tr) => tr.lang_id) || [],
  });

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
              target_LANGS
                ? target_LANGS?.find((lang) => lang.lang_id === tr.lang_id)
                : undefined
            }
            {...{
              tr,
              diff: diff || 0,
              error,
              isSubmitted,
              OPEN_highlights,
              onChange,
            }}
          />
        );
      }}
    />
  ));
}
