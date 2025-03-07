//
//
//

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_flag, ICON_X } from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import Language_MODEL from "@/src/db/models/Language_MODEL";

import { View } from "react-native";

import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import i18next from "i18next";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { FETCH_langs } from "@/src/features/languages/functions/fetch/FETCH_langs/FETCH_langs";

interface ChosenLangsInputs_PROPS {
  label: string;
  default_lang_ids: string | undefined;
  REMOVE_lang: (lang_id: string) => Promise<void>;
  toggle: () => void;
  error: string | null;
}

export default function ChosenLangs_BLOCK({
  label,
  default_lang_ids = "",
  REMOVE_lang = async () => {},
  toggle = () => {},
  error,
}: ChosenLangsInputs_PROPS) {
  const { t } = useTranslation();
  const currentAppLanguage = useMemo(() => i18next.language, []);

  const [selected_LANGS, SET_selectedLangs] = useState<Language_MODEL[]>([]);

  useEffect(() => {
    (async () => {
      const langs = await FETCH_langs({
        lang_ids: default_lang_ids ? default_lang_ids : [],
      });
      SET_selectedLangs(langs);
    })();
  }, [default_lang_ids]);

  return (
    <Block>
      <Label>{label || "NO LABEL PROVIDED"}</Label>
      {selected_LANGS?.map((lang: Language_MODEL) => {
        return (
          <Btn
            key={"chosen lang" + lang?.lang_id}
            type="active"
            iconLeft={
              <View style={{ marginRight: 4 }}>
                <ICON_flag lang={lang?.lang_id} big={true} />
              </View>
            }
            text={
              currentAppLanguage === "en" ? lang?.lang_in_en : lang?.lang_in_de
            }
            iconRight={<ICON_X rotate={true} color="primary" big={true} />}
            text_STYLES={{ flex: 1 }}
            onPress={async () => await REMOVE_lang(lang?.lang_id || "")}
          />
        );
      })}
      <Btn
        iconLeft={<ICON_X color="primary" />}
        text={t("btn.selectLangs")}
        type="seethrough_primary"
        onPress={toggle}
      />
      {error && <Styled_TEXT type="text_error">{error}</Styled_TEXT>}
    </Block>
  );
}
