//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_flag, ICON_X } from "@/src/components/1_grouped/icons/icons";
import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import React, { useMemo } from "react";
import { View } from "react-native";
import i18next, { t } from "i18next";
import { Lang_TYPE } from "@/src/features_new/languages/types";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { USE_searchedLangs } from "@/src/features_new/languages/hooks";

interface LangFlatlist_PROPS {
  search: string;
  selectedLang_IDS: string[];

  SELECT_lang: (lang_id: string) => void;
}

export function Lang_FLATLIST({
  search = "",
  selectedLang_IDS = [],

  SELECT_lang = () => {},
}: LangFlatlist_PROPS) {
  const appLang = useMemo(() => i18next.language, []);
  const { searched_LANGS = [] } = USE_searchedLangs({ search });

  return (
    <Styled_FLASHLIST
      gap={8}
      data={searched_LANGS}
      extraData={[searched_LANGS]}
      keyboardShouldPersistTaps="always"
      ListHeaderComponent={
        <Label styles={{ marginBottom: 8 }}>
          {search === ""
            ? t("label.allLanguages")
            : `${searched_LANGS?.length} ${t(
                "label.searchResultCount"
              )} '${search}'`}
        </Label>
      }
      renderItem={({ item: lang }) => {
        const IS_selected = selectedLang_IDS.some(
          (lang_id) => lang_id === lang.lang_id
        );

        return (
          <Btn
            key={"Select lang" + lang.id + lang.lang_in_en}
            iconLeft={
              <View style={{ marginRight: 4 }}>
                <ICON_flag lang={lang?.lang_id} big={true} />
              </View>
            }
            iconRight={
              <ICON_X
                color={IS_selected ? "primary" : "grey"}
                rotate={IS_selected}
                big={true}
              />
            }
            text={appLang === "en" ? lang.lang_in_en : lang.lang_in_de}
            onPress={() => SELECT_lang(lang.lang_id)}
            type={IS_selected ? "active" : "simple"}
            style={{ flex: 1 }}
            text_STYLES={{ flex: 1 }}
          />
        );
      }}
      keyExtractor={(lang) => "Select lang" + lang.id + lang.lang_in_en}
    />
  );
}
