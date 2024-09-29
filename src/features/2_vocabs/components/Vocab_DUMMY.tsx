//
//
//

import Highlighted_TEXT from "@/src/components/Highlighted_TEXT/Highlighted_TEXT";
import { ICON_difficultyDot, ICON_flag } from "@/src/components/icons/icons";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import {
  MyVocabDisplaySettings_PROPS,
  PublicVocab_MODEL,
  PublicVocabDisplaySettings_PROPS,
  TranslationCreation_PROPS,
  Vocab_MODEL,
} from "@/src/db/models";
import i18next from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, View } from "react-native";

interface VocabFront_PROPS {
  displaySettings:
    | MyVocabDisplaySettings_PROPS
    | PublicVocabDisplaySettings_PROPS;
  HAS_difficulty?: boolean;
}

export default function Vocab_DUMMY({
  displaySettings,
  HAS_difficulty = true,
}: VocabFront_PROPS) {
  const { SHOW_image, SHOW_description, SHOW_flags, SHOW_difficulty } =
    displaySettings;

  const { t } = useTranslation();
  const appLang = useMemo(() => i18next.language, []);

  return (
    <View style={s.parent}>
      {SHOW_image && (
        <Image
          source={require("@/src/assets/images/dummyImage.jpg")}
          style={{ height: 160, width: "100%" }}
        />
      )}

      <View style={s.content}>
        <Highlighted_TEXT
          text={t("vocabDummy.title")}
          highlights={
            appLang === "en"
              ? [14, 15, 16, 17, 18, 19, 20]
              : appLang === "de"
              ? [14, 15, 16, 17]
              : []
          }
          modal_DIFF={0}
        />
        {SHOW_description && (
          <Styled_TEXT type="label_small">
            {t("vocabDummy.description")}
          </Styled_TEXT>
        )}
        {(SHOW_flags || SHOW_difficulty) && (
          <View style={s.iconWrap}>
            {SHOW_flags && (
              <>
                <ICON_flag lang={"en"} />
                <ICON_flag lang={"de"} />
              </>
            )}
            {SHOW_difficulty && HAS_difficulty && (
              <ICON_difficultyDot difficulty={3} />
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  parent: {
    backgroundColor: MyColors.btn_1,
    borderColor: MyColors.border_white_005,
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: 12,
  },

  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconWrap: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 4,
  },
});
