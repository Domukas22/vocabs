//
//
//

import Block from "@/src/components/Basic/Block/Block";
import Btn from "@/src/components/Basic/Btn/Btn";
import { ICON_flag, ICON_X } from "@/src/components/Basic/icons/icons";
import Label from "@/src/components/Basic/Label/Label";
import { Language_MODEL, TranslationCreation_PROPS } from "@/src/db/models";
import { View } from "react-native";
import { VocabModal_ACTIONS } from "../../hooks/USE_modalToggles";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import i18next from "i18next";

interface ChosenLangsInputs_PROPS {
  modal_LANGS: Language_MODEL[];
  REMOVE_lang: (lang_id: string) => void;
  TOGGLE_modal: (action: VocabModal_ACTIONS) => void;
}

export default function ChosenLangs_INPUTS({
  modal_LANGS,
  REMOVE_lang,
  TOGGLE_modal,
}: ChosenLangsInputs_PROPS) {
  const { t } = useTranslation();
  const currentAppLanguage = useMemo(() => i18next.language, []);

  return (
    <Block>
      <Label>{t("label.chosenLangs")}</Label>
      {modal_LANGS.map((lang: Language_MODEL) => {
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
        onPress={() => TOGGLE_modal("selectedLangs")}
      />
    </Block>
  );
}
