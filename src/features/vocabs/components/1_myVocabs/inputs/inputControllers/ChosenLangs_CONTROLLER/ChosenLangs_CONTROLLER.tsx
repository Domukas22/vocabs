//
//
//

import { HANDLE_langRemoval } from "@/src/features/vocabs/functions";
import { t } from "i18next";
import { Control, Controller } from "react-hook-form";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_flag, ICON_X } from "@/src/components/1_grouped/icons/icons";
import TinyBtnScroll_BLOCK from "@/src/components/1_grouped/blocks/TinyBtnScroll_BLOCK/TinyBtnScroll_BLOCK";
import { View } from "react-native";
import { MyColors } from "@/src/constants/MyColors";

interface ChosenLangsController_PROPS {
  control: Control<PublicVocabData_PROPs, any>;
  TOGGLE_langModal: () => void;
}

export function ChosenLangs_CONTROLLER({
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
          <View
            style={{
              gap: 12,
              borderBottomWidth: 1,
              borderBottomColor: MyColors.border_white_005,
            }}
          >
            <TinyBtnScroll_BLOCK
              last_BTN={
                <Btn
                  iconLeft={<ICON_X />}
                  text={t("btn.selectLangs")}
                  onPress={TOGGLE_langModal}
                  tiny={true}
                  style={{ marginRight: 24 }}
                />
              }
            >
              {value?.map((tr, i) => {
                return (
                  <Btn
                    key={tr?.lang_id + "tinyLang"}
                    iconLeft={<ICON_flag lang={tr?.lang_id} />}
                    text={tr?.lang_id?.toUpperCase()}
                    iconRight={<ICON_X color="primary" rotate={true} />}
                    onPress={() =>
                      HANDLE_langRemoval({
                        lang_id: tr?.lang_id,
                        current_TRS: value,
                        SET_trs: onChange,
                      })
                    }
                    type="active"
                    tiny={true}
                    style={{ marginRight: 8 }}
                  />
                );
              })}
            </TinyBtnScroll_BLOCK>
            {error?.types?.validate && (
              <Styled_TEXT
                type="text_error"
                style={{ paddingHorizontal: 12, paddingBottom: 12 }}
              >
                {error?.types?.validate}
              </Styled_TEXT>
            )}
          </View>
        );
      }}
    />
  );
}
