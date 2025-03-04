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
import {
  PublicVocabCard_DUMMY,
  PublicVocabCardFrontLangToggle_BLOCK,
} from "./parts";
import { DisplaySettingsModalContent_SCROLLVIEW } from "../../../../parts";
import { z_USE_publicVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_publicVocabsDisplaySettings/z_USE_publicVocabsDisplaySettings";

export function PublicVocabsCardPreview_CONTENT() {
  const { appearance, z_TOGGLE_showDescription } =
    z_USE_publicVocabsDisplaySettings();

  const { SHOW_description = false } = appearance;

  return (
    <>
      <PublicVocabCard_DUMMY />
      <DisplaySettingsModalContent_SCROLLVIEW>
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
            </View>
          </View>
        </Block>
        <PublicVocabCardFrontLangToggle_BLOCK />
      </DisplaySettingsModalContent_SCROLLVIEW>
    </>
  );
}
