//
//
//

import Block from "@/src/components/Block/Block";
import Label from "@/src/components/Label/Label";
import Settings_TOGGLE from "@/src/components/Settings_TOGGLE/Settings_TOGGLE";
import { MyColors } from "@/src/constants/MyColors";
import { Language_MODEL, VocabDisplaySettings_PROPS } from "@/src/db/models";
import Vocab_DUMMY from "@/src/features/2_vocabs/components/Vocab_DUMMY";
import { t } from "i18next";
import { View } from "react-native";
import VocabFrontLang_BLOCK from "../../VocabFrontLang_BLOCK/VocabFrontLang_BLOCK";

export default function MyVocabPreview_BLOCKS({
  displaySettings,
  SET_displaySettings,
  TOGGLE_frontLangModal,
}: {
  displaySettings: VocabDisplaySettings_PROPS;
  SET_displaySettings: React.Dispatch<
    React.SetStateAction<VocabDisplaySettings_PROPS>
  >;
  TOGGLE_frontLangModal: () => void;
}) {
  return (
    <>
      <Block>
        <Label>{t("label.vocabPreview")}</Label>
        <View style={{ gap: 12 }}>
          {/* <View
          style={{
            borderRadius: 16,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: MyColors.border_white_005,
          }}
        >
          <Vocab_DUMMY {...{ displaySettings }} />
        </View> */}
          <View
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: MyColors.border_white_005,
              overflow: "hidden",
            }}
          >
            <Settings_TOGGLE
              text={t("toggle.showImage")}
              active={displaySettings?.SHOW_image}
              onPress={() => {
                SET_displaySettings((p) => ({
                  ...p,
                  SHOW_image: !p.SHOW_image,
                }));
              }}
            />

            <Settings_TOGGLE
              text={t("toggle.showDescription")}
              active={displaySettings?.SHOW_description}
              onPress={() => {
                SET_displaySettings((p) => ({
                  ...p,
                  SHOW_description: !p.SHOW_description,
                }));
              }}
            />
            <Settings_TOGGLE
              text={t("toggle.showFlags")}
              active={displaySettings?.SHOW_flags}
              onPress={() => {
                SET_displaySettings((p) => ({
                  ...p,
                  SHOW_flags: !p.SHOW_flags,
                }));
              }}
            />
            <Settings_TOGGLE
              text={t("toggle.showDifficulty")}
              active={displaySettings?.SHOW_difficulty}
              onPress={() => {
                SET_displaySettings((p) => ({
                  ...p,
                  SHOW_difficulty: !p.SHOW_difficulty,
                }));
              }}
              last
            />
          </View>
          <Vocab_DUMMY {...{ displaySettings }} />
        </View>
      </Block>
      <VocabFrontLang_BLOCK
        selectedLang_ID={displaySettings.frontTrLang_ID}
        TOGGLE_modal={TOGGLE_frontLangModal}
      />
    </>
  );
}
//
