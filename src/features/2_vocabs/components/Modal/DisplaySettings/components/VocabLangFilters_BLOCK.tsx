import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import {
  ICON_X,
  ICON_difficultyDot,
  ICON_flag,
} from "@/src/components/icons/icons";
import Label from "@/src/components/Label/Label";
import { UpdateDisplaySettings_PROPS } from "@/src/hooks/USE_displaySettings/USE_displaySettings";
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings";
import { t } from "i18next";
import { DisplaySettingsModalView_PROPS } from "../DisplaySettings_MODAL/VocabDisplaySettings_MODAL";
import GET_handledDifficulties from "../DisplaySettings_MODAL/utils/GET_handledDifficulties";
import {
  z_vocabDisplaySettings_PROPS,
  z_setVocabDisplaySettings_PROPS,
} from "@/src/zustand";
import { useCallback } from "react";
import { Language_MODEL } from "@/src/db/watermelon_MODELS";
import { View } from "react-native";

export default function VocabLangFilters_BLOCK({
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
  const SELECT_langFilter = useCallback(
    (incoming_LANG: string) => {
      const newLangs = GET_handledLangs({
        langFilters: z_vocabDisplay_SETTINGS?.langFilters || [],
        incoming_LANG,
      });

      const correctedFrontLangId = GET_handledFrontLangId({
        frontLang_ID: z_vocabDisplay_SETTINGS?.frontTrLang_ID || "en",
        newLang_IDS: newLangs,
      });

      if (z_SET_vocabDisplaySettings) {
        z_SET_vocabDisplaySettings({
          langFilters: newLangs,
          frontTrLang_ID: correctedFrontLangId,
        });
      }
    },
    [z_vocabDisplay_SETTINGS]
  );

  return view === "filter" ? (
    <Block>
      <Label>{t("label.filterByLanguage")}</Label>
      {langs?.map((lang, index) => {
        return (
          <Btn
            key={`langFilterBtn ${lang?.lang_id}`}
            iconLeft={
              <View style={{ marginRight: 4 }}>
                <ICON_flag lang={lang?.lang_id} big={true} />
              </View>
            }
            text={lang[`lang_in_${appLang || "en"}`]}
            iconRight={
              z_vocabDisplay_SETTINGS?.langFilters.some(
                (lang_ID) => lang_ID === lang?.lang_id
              ) ? (
                <ICON_X big rotate color="primary" />
              ) : null
            }
            type={
              z_vocabDisplay_SETTINGS?.langFilters.some(
                (lang_ID) => lang_ID === lang?.lang_id
              )
                ? "active"
                : "simple"
            }
            style={[index === langs?.length - 1 && { marginBottom: 24 }]}
            text_STYLES={{ flex: 1 }}
            onPress={() => SELECT_langFilter(lang?.lang_id)}
          />
        );
      })}
    </Block>
  ) : null;
}

function GET_handledLangs({
  langFilters,
  incoming_LANG,
}: {
  langFilters: string[];
  incoming_LANG: string;
}) {
  if (langFilters) {
    return langFilters.some((d) => d === incoming_LANG)
      ? langFilters.filter((d) => d !== incoming_LANG)
      : [...langFilters, incoming_LANG];
  }

  return langFilters;
}
function GET_handledFrontLangId({
  frontLang_ID,
  newLang_IDS,
}: {
  frontLang_ID: string;
  newLang_IDS: string[];
}) {
  if (newLang_IDS.length === 0) return frontLang_ID;
  if (newLang_IDS.length === 1) return newLang_IDS[0];

  return frontLang_ID;
}
