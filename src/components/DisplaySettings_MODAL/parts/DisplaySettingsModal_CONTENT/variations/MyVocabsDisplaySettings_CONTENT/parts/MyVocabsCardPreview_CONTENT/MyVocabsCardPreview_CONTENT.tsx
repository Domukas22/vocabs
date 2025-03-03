//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import {
  ICON_letterT,
  ICON_flag,
  ICON_difficultyDot,
} from "@/src/components/1_grouped/icons/icons";
import Custom_TOGGLE from "@/src/components/1_grouped/inputs/Custom_TOGGLE/Custom_TOGGLE";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { MyColors } from "@/src/constants/MyColors";
import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";

import { t } from "i18next";
import { View } from "react-native";
import { MyVocabCard_DUMMY, MyVocabCardFrontLangToggle_BLOCK } from "./parts";

export function MyVocabsCardPreview_CONTENT() {
  const {
    appearance,
    z_TOGGLE_showDescription,
    z_TOGGLE_showDifficulty,
    z_TOGGLE_showFlags,
  } = z_USE_myVocabsDisplaySettings();

  const {
    SHOW_description = false,
    SHOW_difficulty = false,
    SHOW_flags = false,
    frontTrLang_ID = "en",
  } = appearance;

  return (
    <>
      <MyVocabCard_DUMMY />
      <Block>
        <Label>{t("label.vocabPreview")}</Label>
        <View style={{ gap: 12, marginTop: 4 }}>
          <View
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: MyColors.border_white_005,
              overflow: "hidden",
            }}
          >
            <Custom_TOGGLE
              icon={<ICON_letterT />}
              text={t("toggle.showDescription")}
              active={SHOW_description}
              onPress={z_TOGGLE_showDescription}
            />
            <Custom_TOGGLE
              icon={<ICON_flag big lang={frontTrLang_ID} />}
              text={t("toggle.showFlags")}
              active={SHOW_flags}
              onPress={z_TOGGLE_showFlags}
            />
            <Custom_TOGGLE
              icon={<ICON_difficultyDot size="big" difficulty={3} />}
              text={t("toggle.showDifficulty")}
              active={SHOW_difficulty}
              onPress={z_TOGGLE_showDifficulty}
              last
            />
          </View>
        </View>
      </Block>
      <MyVocabCardFrontLangToggle_BLOCK />
    </>
  );
}
