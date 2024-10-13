//
//
//

import { tr_PROPS } from "@/src/db/props";
import { Language_MODEL } from "@/src/db/watermelon_MODELS";
import Block from "@/src/components/Block/Block";
import { ICON_flag } from "@/src/components/icons/icons";
import Btn from "@/src/components/Btn/Btn";
import React, { useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { MyColors } from "@/src/constants/MyColors";
import Highlighted_TEXT from "@/src/components/Highlighted_TEXT/Highlighted_TEXT";
import Label from "@/src/components/Label/Label";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import StyledText_INPUT from "@/src/components/StyledText_INPUT/StyledText_INPUT";
import { USE_langs } from "@/src/context/Langs_CONTEXT";
import { FieldError } from "react-hook-form";

interface VocabTranslationInputs_PROPS {
  tr: tr_PROPS;
  diff: 0 | 1 | 2 | 3;
  OPEN_highlights: (tr: tr_PROPS) => void;
  error: FieldError | undefined;
  isSubmitted: boolean;
  onChange: (...event: any[]) => void;
}

export default function TrInput_BLOCK({
  tr,
  diff,
  OPEN_highlights,
  error,
  isSubmitted,
  onChange,
}: VocabTranslationInputs_PROPS) {
  const { t } = useTranslation();
  const appLang = useMemo(() => i18next.language, []);
  const { languages } = USE_langs();

  const lang = useMemo(
    () => languages?.find((lang: Language_MODEL) => lang.id === tr.lang_id),
    []
  );

  const inputREF = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Block
      labelIcon={<ICON_flag lang={tr?.lang_id} />}
      styles={{ padding: 12 }}
    >
      <Label icon={<ICON_flag lang={lang?.id} big />}>{`${t(
        "word.translation"
      )} auf ${lang?.[`lang_in_${appLang || "en"}`]} *`}</Label>

      <View style={{ position: "relative" }}>
        {!isFocused && (
          <View
            style={[
              s.overlay,
              isSubmitted &&
                !error && {
                  paddingRight: 44,
                },
            ]}
            pointerEvents="none"
          >
            {tr.text && (
              <Highlighted_TEXT
                text={tr.text}
                highlights={tr.highlights}
                light
                {...{ diff }}
              />
            )}
          </View>
        )}
        {/* <View
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,

            zIndex: 10,
          }}
        >
          <Btn
            iconLeft={<ICON_difficultyDot difficulty={diff} big />}
            type="seethrough"
            onPress={() => {}}
          />
        </View> */}

        <StyledText_INPUT
          multiline
          value={tr.text}
          SET_value={onChange}
          // placeholder={t("placeholder.translation")}
          _ref={inputREF}
          {...{ error, isSubmitted, isFocused, setIsFocused }}
        />
      </View>
      {error && <Styled_TEXT type="text_error">{error.message}</Styled_TEXT>}

      <View style={{ flexDirection: "row", gap: 8 }}>
        {/* <Btn text="Remove" type="seethrough" onPress={() => {}} /> */}
        {tr.text && (
          <Btn
            text={t("btn.editHighlights")}
            type="seethrough"
            onPress={() => {
              OPEN_highlights(tr);
              setIsFocused(false);
              inputREF.current?.blur();
            }}
            style={{ flex: 1 }}
          />
        )}
      </View>
      {/* <Styled_TEXT>Highlights: {tr.highlights}</Styled_TEXT> */}
    </Block>
  );
}

const s = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    // justifyContent: "center",

    zIndex: 10,

    paddingHorizontal: 16,
    paddingVertical: 12,

    backgroundColor: MyColors.btn_2,
    borderRadius: 12,
    // borderWidth: 1,
    // borderColor: MyColors.border_white_005,
  },
  textBtnPress: {
    backgroundColor: MyColors.btn_3,
  },
});
