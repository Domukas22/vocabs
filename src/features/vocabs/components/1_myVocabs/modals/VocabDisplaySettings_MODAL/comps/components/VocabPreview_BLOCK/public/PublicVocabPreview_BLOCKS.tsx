//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import Custom_TOGGLE from "@/src/components/1_grouped/inputs/Custom_TOGGLE/Custom_TOGGLE";
import { MyColors } from "@/src/constants/MyColors";

import i18next, { t } from "i18next";
import { ScrollView, View } from "react-native";

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_checkMark,
  ICON_flag,
} from "@/src/components/1_grouped/icons/icons";
import { useMemo } from "react";
import Language_MODEL from "@/src/db/models/Language_MODEL";
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings/DisplaySettings";

export default function PublicVocabPreview_BLOCKS({
  displaySettings,
  SET_displaySettings,
  available_LANGS,
}: {
  displaySettings: _DisplaySettings_PROPS;
  SET_displaySettings: React.Dispatch<
    React.SetStateAction<_DisplaySettings_PROPS>
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
            <Custom_TOGGLE
              text={t("toggle.showDescription")}
              active={displaySettings?.SHOW_description}
              onPress={() => {
                SET_displaySettings((p) => ({
                  ...p,
                  SHOW_description: !p.SHOW_description,
                }));
              }}
            />
            <Custom_TOGGLE
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
