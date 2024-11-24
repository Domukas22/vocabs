import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import { ICON_X, ICON_flag } from "@/src/components/icons/icons";
import Label from "@/src/components/Label/Label";
import { t } from "i18next";
import { DisplaySettingsModalView_PROPS } from "../DisplaySettings_MODAL/VocabDisplaySettings_MODAL";
import {
  z_listDisplaySettings_PROPS,
  z_setlistDisplaySettings_PROPS,
} from "@/src/zustand";
import { useCallback } from "react";
import Language_MODEL from "@/src/db/models/Language_MODEL";
import { View } from "react-native";

export default function ListLangFilters_BLOCK({
  view = "preview",
  langs = [],
  appLang = "en",
  z_listDisplay_SETTINGS,
  z_SET_listDisplaySettings,
}: {
  view: DisplaySettingsModalView_PROPS;
  langs: Language_MODEL[] | undefined;
  appLang: string | undefined;
  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS | undefined;
  z_SET_listDisplaySettings: z_setlistDisplaySettings_PROPS | undefined;
}) {
  const SELECT_langFilter = useCallback(
    (incoming_LANG: string) => {
      const newLangs = GET_handledLangs({
        langFilters: z_listDisplay_SETTINGS?.langFilters || [],
        incoming_LANG,
      });

      if (z_SET_listDisplaySettings) {
        z_SET_listDisplaySettings({
          langFilters: newLangs,
        });
      }
    },
    [z_listDisplay_SETTINGS]
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
              z_listDisplay_SETTINGS?.langFilters.some(
                (lang_ID) => lang_ID === lang?.lang_id
              ) ? (
                <ICON_X big rotate color="primary" />
              ) : null
            }
            type={
              z_listDisplay_SETTINGS?.langFilters.some(
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
