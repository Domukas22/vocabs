//
//
//

import Block from "@/src/components/Block/Block";
import Label from "@/src/components/Label/Label";
import Settings_TOGGLE from "@/src/components/Settings_TOGGLE/Settings_TOGGLE";
import { MyColors } from "@/src/constants/MyColors";
import { DisplaySettings_PROPS } from "@/src/db/props";
import Vocab_DUMMY from "@/src/features/2_vocabs/components/Vocab/Components/Vocab_DUMMY";
import i18next, { t } from "i18next";
import { ScrollView, View } from "react-native";
import VocabFrontLang_BLOCK from "../../VocabFrontLang_BLOCK/VocabFrontLang_BLOCK";
import Btn from "@/src/components/Btn/Btn";
import { ICON_checkMark, ICON_flag } from "@/src/components/icons/icons";
import { useMemo } from "react";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { Language_MODEL } from "@/src/db/watermelon_MODELS";

export default function PublicVocabPreview_BLOCKS({
  displaySettings,
  SET_displaySettings,
  available_LANGS,
}: {
  displaySettings: DisplaySettings_PROPS;
  SET_displaySettings: React.Dispatch<
    React.SetStateAction<DisplaySettings_PROPS>
  >;
  available_LANGS: Language_MODEL[];
}) {
  const appLang = useMemo(() => i18next.language, [i18next.language]);

  return (
    <>
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
          </View>
        </View>
      </Block>

      {available_LANGS?.length && available_LANGS?.length > 0 && (
        <Block>
          <Label>{t("label.vocabFrontLang")}</Label>
          <ScrollView>
            {available_LANGS.map((lang, index) => (
              <Btn
                key={"Select lang" + lang?.lang_id + lang.lang_in_en}
                iconLeft={
                  <View style={{ marginRight: 4 }}>
                    <ICON_flag lang={lang?.lang_id} big={true} />
                  </View>
                }
                text={appLang === "en" ? lang.lang_in_en : lang.lang_in_de}
                iconRight={
                  displaySettings.frontTrLang_ID === lang?.lang_id && (
                    <ICON_checkMark color="primary" />
                  )
                }
                onPress={() => {
                  SET_displaySettings((p) => ({
                    ...p,
                    frontTrLang_ID: lang?.lang_id,
                  }));
                }}
                type={
                  displaySettings.frontTrLang_ID === lang?.lang_id
                    ? "active"
                    : "simple"
                }
                style={[
                  { flex: 1, marginBottom: 8 },
                  index === available_LANGS.length - 1 && { marginBottom: 24 },
                ]}
                text_STYLES={{ flex: 1 }}
              />
            ))}
          </ScrollView>
        </Block>
      )}
    </>
  );
}
//
