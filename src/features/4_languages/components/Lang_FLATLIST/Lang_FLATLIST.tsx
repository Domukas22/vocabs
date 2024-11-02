import Btn from "@/src/components/Btn/Btn";
import { ICON_flag, ICON_X } from "@/src/components/icons/icons";
import Styled_FLASHLIST from "@/src/components/Styled_FLATLIST/Styled_FLASHLIST/Styled_FLASHLIST";
import { Language_MODEL } from "@/src/db/watermelon_MODELS";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import FETCH_langs from "../../hooks/FETCH_langs";
import i18next from "i18next";

interface LangFlatlist_PROPS {
  search: string | undefined;
  selected_LANGS: Language_MODEL[] | undefined;
  SELECT_lang: (l: Language_MODEL) => void;
  view: "all" | "selected";
}

export default function Lang_FLATLIST({
  search,
  selected_LANGS,
  SELECT_lang,
  view,
}: LangFlatlist_PROPS) {
  const appLang = useMemo(() => i18next.language, []);

  const [all_LANGS, SET_allLangs] = useState<Language_MODEL[]>([]);

  useEffect(() => {
    (async () => {
      const langs = await FETCH_langs({ search });
      SET_allLangs(langs);
    })();
  }, [search]);

  return (
    <Styled_FLASHLIST
      gap={8}
      data={
        view === "selected"
          ? all_LANGS.filter((x) => selected_LANGS?.some((l) => l.id === x.id))
          : all_LANGS
      }
      keyboardShouldPersistTaps="always"
      renderItem={({ item }) => {
        const IS_selected = selected_LANGS?.some((l) => l.id === item.id);

        return (
          <Btn
            key={"Select lang" + item.id + item.lang_in_en}
            iconLeft={
              <View style={{ marginRight: 4 }}>
                <ICON_flag lang={item?.lang_id} big={true} />
              </View>
            }
            iconRight={
              <ICON_X
                color={IS_selected ? "primary" : "grey"}
                rotate={IS_selected}
                big={true}
              />
            }
            text={appLang === "en" ? item.lang_in_en : item.lang_in_de}
            onPress={() => SELECT_lang(item)}
            type={IS_selected ? "active" : "simple"}
            style={{ flex: 1 }}
            text_STYLES={{ flex: 1 }}
          />
        );
      }}
      keyExtractor={(item) => "Select lang" + item.id + item.lang_in_en}
    />
  );
}
