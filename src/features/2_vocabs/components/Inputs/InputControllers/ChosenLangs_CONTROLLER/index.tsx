//
//
//

import HANDLE_langRemoval from "@/src/features/2_vocabs/utils/HANLDE_langRemoval";
import { t } from "i18next";
import { Control, Controller } from "react-hook-form";
import { CreateMyVocabData_PROPS } from "../../../Modal/CreateMyVocab_MODAL/CreateMyVocab_MODAL";
import TinyLang_SCROLLER from "@/src/features/4_languages/components/TinyLang_SCROLLER/TinyLang_SCROLLER";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import { CreatePublicVocabData_PROPS } from "../../../Modal/CreatePublicVocab_MODAL/CreatePublicVocab_MODAL";

interface ChosenLangsController_PROPS {
  control: Control<CreatePublicVocabData_PROPS, any>;
  TOGGLE_langModal: () => void;
}

export default function ChosenLangs_CONTROLLER({
  control,
  TOGGLE_langModal,
}: ChosenLangsController_PROPS) {
  return (
    <Controller
      control={control}
      name="translations"
      rules={{
        validate: (value) =>
          (Array.isArray(value) && value?.length > 0) ||
          "Please select at least one translation",
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        return (
          <TinyLang_SCROLLER
            {...{ TOGGLE_langModal }}
            trs={value}
            REMOVE_lang={(lang_id: string) => {
              HANDLE_langRemoval({
                lang_id,
                current_TRS: value,
                SET_trs: onChange,
              });
            }}
            last_BTN={
              <Btn
                iconLeft={<ICON_X />}
                text={t("btn.selectLangs")}
                onPress={TOGGLE_langModal}
                tiny={true}
                style={{ marginRight: 8 }}
              />
            }
            bottomBorder
            bottom_EL={
              error?.types?.validate && (
                <Styled_TEXT
                  type="text_error"
                  style={{ paddingHorizontal: 12, paddingBottom: 12 }}
                >
                  {error?.types?.validate}
                </Styled_TEXT>
              )
            }
          />
        );
      }}
    />
  );
}
