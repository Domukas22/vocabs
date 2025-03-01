//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_flag, ICON_X } from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { z_USE_langs } from "@/src/features_new/languages/hooks/zustand/z_USE_langs/z_USE_langs";
import { Lang_TYPE } from "@/src/features_new/languages/types";
import i18next, { t } from "i18next";
import { useMemo } from "react";
import { View } from "react-native";

export function LanguagesBtn_BLOCK({
  label = "Label",
  allLang_IDs = [],
  activeLang_IDs = [],
  HANDLE_lang = () => {},
}: {
  label: string;
  allLang_IDs: string[];
  activeLang_IDs: string[];
  HANDLE_lang: (lang_ID: string) => void;
}) {
  const appLang = useMemo(() => i18next.language, [i18next.language]);
  const { z_GET_langsByLangId } = z_USE_langs();
  const langs = useMemo(() => z_GET_langsByLangId(allLang_IDs), [allLang_IDs]);

  return (
    <Block>
      <Label>{label}</Label>
      {langs?.map((lang, index) => {
        const active = activeLang_IDs.some(
          (lang_ID) => lang_ID === lang?.lang_id
        );
        return (
          <Btn
            key={`langFilterBtn ${lang} ${index}`}
            iconLeft={
              <View style={{ marginRight: 4 }}>
                <ICON_flag lang={lang.lang_id} big={true} />
              </View>
            }
            text={
              lang[`lang_in_${appLang || "en"}` as keyof Lang_TYPE] as string
            }
            iconRight={active ? <ICON_X big rotate color="primary" /> : null}
            type={active ? "active" : "simple"}
            text_STYLES={{ flex: 1 }}
            onPress={() => HANDLE_lang(lang.lang_id)}
          />
        );
      })}
    </Block>
  );
}
