//
//
//

import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import { ICON_flag, ICON_X } from "@/src/components/icons/icons";
import Label from "@/src/components/Label/Label";
import { Language_MODEL, TranslationCreation_PROPS } from "@/src/db/models";
import { View } from "react-native";

import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import i18next from "i18next";
import { USE_langs } from "@/src/context/Langs_CONTEXT";
import GET_langsFromTranslations from "@/src/utils/GET_langsFromTranslations";

interface ChosenLangsInputs_PROPS {
  label: string;
  trs: TranslationCreation_PROPS[];
  REMOVE_lang: (lang_id: string) => void;
  toggle: () => void;
}

export default function ChosenLangs_BLOCK({
  label,
  trs,
  REMOVE_lang = () => {},
  toggle = () => {},
}: ChosenLangsInputs_PROPS) {
  const { t } = useTranslation();
  const currentAppLanguage = useMemo(() => i18next.language, []);
  const { languages } = USE_langs();
  const langs = useMemo(() => GET_langsFromTranslations(trs, languages), [trs]);

  return (
    <Block>
      <Label>{label || "NO LABEL PROVIDED"}</Label>
      {langs?.map((lang: Language_MODEL) => {
        return (
          <Btn
            key={"chosen lang" + lang.id}
            type="active"
            iconLeft={
              <View style={{ marginRight: 4 }}>
                <ICON_flag lang={lang?.id} big={true} />
              </View>
            }
            text={
              currentAppLanguage === "en" ? lang?.lang_in_en : lang?.lang_in_de
            }
            iconRight={<ICON_X rotate={true} color="primary" big={true} />}
            text_STYLES={{ flex: 1 }}
            onPress={() => REMOVE_lang(lang?.id || "")}
          />
        );
      })}
      <Btn
        iconLeft={<ICON_X color="primary" />}
        text={t("btn.selectLangs")}
        type="seethrough_primary"
        onPress={toggle}
      />
    </Block>
  );
}
