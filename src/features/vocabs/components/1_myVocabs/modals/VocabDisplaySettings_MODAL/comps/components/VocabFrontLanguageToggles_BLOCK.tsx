//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_flag,
  ICON_checkMark,
} from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import Language_MODEL from "@/src/db/models/Language_MODEL";
import {
  z_vocabDisplaySettings_PROPS,
  z_setVocabDisplaySettings_PROPS,
} from "@/src/hooks/zustand/USE_zustand/USE_zustand";
import { t } from "i18next";
import { ScrollView, View } from "react-native";
import { DisplaySettingsModalView_PROPS } from "../../VocabDisplaySettings_MODAL";

//
export default function VocabFrontLanguageToggles_BLOCK({
  view = "preview",
  langs = [],
  appLang = "en",
  z_vocabDisplay_SETTINGS,
  z_SET_vocabDisplaySettings,
}: {
  view: DisplaySettingsModalView_PROPS;
  langs: Language_MODEL[] | undefined;
  appLang: string | undefined;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS | undefined;
  z_SET_vocabDisplaySettings: z_setVocabDisplaySettings_PROPS | undefined;
}) {
  return view === "preview" && langs && langs?.length > 0 ? (
    <Block>
      <Label>{t("label.vocabFrontLang")}</Label>
      <ScrollView>
        {langs?.map((lang, index) => (
          <Btn
            key={"Select lang" + lang?.lang_id + lang.lang_in_en}
            iconLeft={
              <View style={{ marginRight: 4 }}>
                <ICON_flag lang={lang?.lang_id} big={true} />
              </View>
            }
            text={appLang === "en" ? lang.lang_in_en : lang.lang_in_de}
            iconRight={
              z_vocabDisplay_SETTINGS?.frontTrLang_ID === lang?.lang_id && (
                <ICON_checkMark color="primary" />
              )
            }
            onPress={() => {
              if (z_SET_vocabDisplaySettings) {
                z_SET_vocabDisplaySettings({ frontTrLang_ID: lang?.lang_id });
              }
            }}
            type={
              z_vocabDisplay_SETTINGS?.frontTrLang_ID === lang?.lang_id
                ? "active"
                : "simple"
            }
            style={[
              { flex: 1, marginBottom: 8 },
              index === langs.length - 1 && { marginBottom: 24 },
            ]}
            text_STYLES={{ flex: 1 }}
          />
        ))}
      </ScrollView>
    </Block>
  ) : null;
}
