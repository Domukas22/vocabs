//
//
//

import Highlighted_TEXT from "@/src/components/Highlighted_TEXT/Highlighted_TEXT";
import { ICON_difficultyDot, ICON_flag } from "@/src/components/icons/icons";
import Label from "@/src/components/Label/Label";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { USE_langs } from "@/src/context/Langs_CONTEXT";
import {
  VocabDisplaySettings_PROPS,
  Translation_MODEL,
  TranslationCreation_PROPS,
  Language_MODEL,
} from "@/src/db/models";
import i18next, { t } from "i18next";
import { useMemo } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

interface VocabFront_PROPS {
  vocab_id: string;
  displaySettings: VocabDisplaySettings_PROPS;
  translations: Translation_MODEL[] | undefined;
  difficulty: 0 | 1 | 2 | 3 | undefined;
  description: string | undefined;
  open: boolean;
  TOGGLE_open: () => void;
  highlighted?: boolean;
}

export default function Vocab_FRONT({
  vocab_id,
  translations,
  difficulty,
  description,
  displaySettings,
  open,
  TOGGLE_open,
  highlighted,
}: VocabFront_PROPS) {
  const {
    SHOW_image,
    SHOW_description,
    SHOW_flags,
    SHOW_difficulty,
    frontTrLang_ID,
  } = displaySettings;

  const front_TR = useMemo(() => {
    return (
      translations?.find(
        (tr) =>
          tr.lang_id === frontTrLang_ID &&
          tr.text !== "" &&
          tr.text !== undefined &&
          tr.text !== null
      ) ||
      // ------- if select lang id not found, just select the first transaltion

      // translations?.find(
      //   (tr) => tr.text !== "" && tr.text !== undefined && tr.text !== null
      // ) ||
      null
    );
  }, [translations, frontTrLang_ID]);

  const { languages } = USE_langs();
  const appLang = useMemo(() => i18next.language, [i18next.language]);
  const targetLang = useMemo(
    () => languages?.find((lang) => lang.id === displaySettings.frontTrLang_ID),
    [displaySettings.frontTrLang_ID]
  );

  return (
    <Pressable
      style={({ pressed }) => [
        s.parent,
        pressed && s.parentPressed,
        highlighted && s.parentHighlighted,
      ]}
      onPress={TOGGLE_open}
    >
      {SHOW_image && (
        <Image
          source={require("@/src/assets/images/dummyImage.jpg")}
          style={{ height: 200, width: "100%" }}
        />
      )}
      {!open && (
        <View style={s.content}>
          {front_TR ? (
            <Highlighted_TEXT
              text={front_TR?.text || "EMPTY TRANSLATION"}
              highlights={front_TR?.highlights || []}
              modal_DIFF={difficulty || 0}
            />
          ) : (
            <Label>
              {t("label.missingTranslation") +
                targetLang?.[`lang_in_${appLang || "en"}`]}
            </Label>
          )}
          {SHOW_description && description && (
            <Styled_TEXT type="label_small">{description}</Styled_TEXT>
          )}
          {(SHOW_flags || SHOW_difficulty) && (
            <View style={s.iconWrap}>
              {SHOW_flags &&
                translations?.map((tr) => (
                  <ICON_flag
                    key={"FrontFlag" + vocab_id + tr.lang_id}
                    lang={tr.lang_id}
                  />
                ))}
              {SHOW_difficulty && !!difficulty && (
                <ICON_difficultyDot difficulty={difficulty} />
              )}
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  parent: {
    backgroundColor: MyColors.btn_2,
  },
  parentPressed: {
    backgroundColor: MyColors.btn_3,
  },
  parentHighlighted: {
    backgroundColor: MyColors.btn_green,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconWrap: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 12,
  },
});
