//
//
//

import {
  ICON_difficultyDot,
  ICON_flag,
} from "@/src/components/Basic/icons/icons";
import Highlighted_TEXT from "@/src/components/Compound/Highlighted_TEXT/Highlighted_TEXT";
import { Styled_TEXT } from "@/src/components/Basic/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import {
  DisplaySettings_MODEL,
  PublicDisplaySettings_MODEL,
  PublicVocab_MODEL,
  Vocab_MODEL,
} from "@/src/db/models";
import i18next from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet } from "react-native";
import { View } from "react-native";

interface PublicVocabFront_PROPS {
  displaySettings: PublicDisplaySettings_MODEL;
  visible?: boolean;
  vocab?: PublicVocab_MODEL;
  onPress?: () => void;
  disablePressAnimation?: boolean;
  dummy?: boolean;
}

export default function PublicVocab_FRONT({
  visible = true,
  vocab,
  displaySettings,
  onPress,
  disablePressAnimation = false,
  dummy = false,
}: PublicVocabFront_PROPS) {
  const { SHOW_image, SHOW_description, SHOW_flags } = displaySettings;

  const lang_IDs = useMemo(
    () => vocab?.public_translations?.map((tr) => tr.lang_id) || [],
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
              vocab?.public_translations &&
              vocab?.public_translations?.length > 0 && (
                <Highlighted_TEXT
                  text={vocab?.public_translations?.[0].text}
                  highlights={vocab?.public_translations?.[0].highlights}
                  modal_DIFF={0}
                />
              )}
            {dummy && (
              <Highlighted_TEXT
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

            {!dummy && SHOW_flags && (
              <View style={s.topIconWrap}>
                {SHOW_flags &&
                  lang_IDs.map((lang) => <ICON_flag key={lang} lang={lang} />)}
              </View>
            )}
            {dummy && SHOW_flags && (
              <View style={s.topIconWrap}>
                {SHOW_flags && (
                  <>
                    <ICON_flag lang="en" />
                    <ICON_flag lang="de" />
                  </>
                )}
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
