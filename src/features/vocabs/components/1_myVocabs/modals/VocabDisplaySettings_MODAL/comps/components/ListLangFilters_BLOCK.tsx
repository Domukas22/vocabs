//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_X, ICON_flag } from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import i18next, { t } from "i18next";
import {
  USE_zustand,
  z_listDisplaySettings_PROPS,
  z_setlistDisplaySettings_PROPS,
} from "@/src/hooks/zustand/USE_zustand/USE_zustand";
import { useCallback, useMemo } from "react";
import { View } from "react-native";
import { USE_langs_2 } from "@/src/features/languages/functions";
import USE_collectAllUniqueLangIdsFromAllLists from "@/src/features/lists/functions/myLists/collectLangs/hooks/USE_collectAllUniqueLangIdsFromAllLists";
import User_MODEL from "@/src/db/models/User_MODEL";

export default function ListLangFilters_BLOCK() {
  const appLang = useMemo(() => i18next.language, [i18next.language]);
  const { z_user, z_listDisplay_SETTINGS, z_SET_listDisplaySettings } =
    USE_zustand();
  const { collectedLang_IDS } = USE_collectAllUniqueLangIdsFromAllLists(z_user);

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
    [collectedLang_IDS, z_listDisplay_SETTINGS, z_SET_listDisplaySettings]
  );

  const { langs } = USE_langs_2({
    lang_ids: collectedLang_IDS || [],
  });

  return (
    <Block>
      <Label>{t("label.filterByLanguage")}</Label>
      {langs?.map((lang, index) => {
        const active = z_listDisplay_SETTINGS?.langFilters.some(
          (lang_ID) => lang_ID === lang?.lang_id
        );
        return (
          <Btn
            key={`langFilterBtn ${lang?.lang_id}`}
            iconLeft={
              <View style={{ marginRight: 4 }}>
                <ICON_flag lang={lang?.lang_id} big={true} />
              </View>
            }
            text={lang[`lang_in_${appLang || "en"}`]}
            iconRight={active ? <ICON_X big rotate color="primary" /> : null}
            type={active ? "active" : "simple"}
            style={[index === langs?.length - 1 && { marginBottom: 24 }]}
            text_STYLES={{ flex: 1 }}
            onPress={() => {
              SELECT_langFilter(lang?.lang_id);
            }}
          />
        );
      })}
    </Block>
  );
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
