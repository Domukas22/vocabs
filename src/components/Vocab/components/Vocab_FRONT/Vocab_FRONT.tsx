//
//
//

import { ICON_difficultyDot, ICON_flag } from "@/src/components/icons/icons";
import RENDER_textWithHighlights from "@/src/components/RENDER_textWithHighlights/RENDER_textWithHighlights";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { DisplaySettings_MODEL, Vocab_MODEL } from "@/src/db/models";
import i18next from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet } from "react-native";
import { View } from "react-native";

interface VocabFront_PROPS {
  displaySettings: DisplaySettings_MODEL;
  listName?: string;
  visible?: boolean;
  vocab?: Vocab_MODEL;
  onPress?: () => void;
  disablePressAnimation?: boolean;
  dummy?: boolean;
}

export default function Vocab_FRONT({
  visible = true,
  vocab,
  displaySettings,
  onPress,
  disablePressAnimation = false,
  listName,
  dummy = false,
}: VocabFront_PROPS) {
  const { SHOW_image, SHOW_description, SHOW_flags, SHOW_difficulty } =
    displaySettings;

  const lang_IDs = useMemo(
    () => vocab?.translations?.map((tr) => tr.lang_id) || [],
    []
  );
  const { t } = useTranslation();
  const appLang = useMemo(() => i18next.language, []);

  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          { backgroundColor: MyColors.btn_2 },
          pressed &&
            !disablePressAnimation && { backgroundColor: MyColors.btn_3 },
          // Pressed and non-pressed styles
        ]}
        onPress={onPress}
      >
        {SHOW_image && (
          <>
            {!dummy ? (
              <Image
                source={require("@/src/assets/images/dummyImage.jpg")}
                style={{ height: 160, width: "100%" }}
              />
            ) : (
              <Image
                source={require("@/src/assets/images/dummyImage.jpg")}
                style={{ height: 160, width: "100%" }}
              />
            )}
          </>
        )}

        {visible && (
          <View style={s.topPadding}>
            {!dummy &&
              vocab?.translations &&
              vocab?.translations?.length > 0 && (
                <RENDER_textWithHighlights
                  text={vocab?.translations?.[0].text}
                  highlights={vocab?.translations?.[0].highlights}
                  modal_DIFF={vocab.difficulty}
                />
              )}
            {dummy && (
              <RENDER_textWithHighlights
                text={t("vocabDummy.translation")}
                highlights={
                  appLang === "en"
                    ? [14, 15, 16, 17, 18, 19, 20]
                    : [15, 16, 17, 18]
                }
                modal_DIFF={3}
              />
            )}

            {!dummy && SHOW_description && vocab?.description && (
              <Styled_TEXT type="label_small">{vocab.description}</Styled_TEXT>
            )}
            {dummy && SHOW_description && (
              <Styled_TEXT type="label_small">
                {t("vocabDummy.description")}
              </Styled_TEXT>
            )}

            {!dummy &&
              (SHOW_flags || SHOW_difficulty) &&
              (vocab?.difficulty || true) && (
                <View style={s.topIconWrap}>
                  {SHOW_flags &&
                    lang_IDs.map((lang) => (
                      <ICON_flag key={lang} lang={lang} />
                    ))}
                  {SHOW_difficulty && vocab?.difficulty && (
                    <ICON_difficultyDot difficulty={vocab?.difficulty} />
                  )}
                </View>
              )}
            {dummy && (SHOW_flags || SHOW_difficulty) && (
              <View style={s.topIconWrap}>
                {SHOW_flags && (
                  <>
                    <ICON_flag lang="en" />
                    <ICON_flag lang="de" />
                  </>
                )}
                {SHOW_difficulty && <ICON_difficultyDot difficulty={3} />}
              </View>
            )}
          </View>
        )}
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  vocab_TITLE: {
    fontSize: 18,
    color: MyColors.text_white,
    fontWeight: "500",
    paddingBottom: 2,
  },
  vocab_SUBTITLE: {
    fontSize: 16,
    color: MyColors.text_white_06,
    fontWeight: "300",
    paddingBottom: 2,
  },
  topPadding: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topIconWrap: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 4,
  },
});
