//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import TwoBtn_BLOCK from "@/src/components/1_grouped/blocks/TwoBtn_BLOCK/TwoBtn_BLOCK";
import i18next, { t } from "i18next";
import { ActivityIndicator } from "react-native";
import { SelectedLang_SCROLLER } from "../SelectedLang_SCROLLER/SelectedLang_SCROLLER";
import Language_MODEL from "@/src/db/models/Language_MODEL";
import { useMemo } from "react";
import { Lang_TYPE } from "@/src/features_new/languages/types";
import { USE_getTargetLangs } from "@/src/features_new/languages/hooks";

interface LangModalFooter_PROPS {
  selectedLang_IDS: string[];
  loading?: boolean | undefined;
  cancel: () => void;
  submit: () => Promise<void>;
  SELECT_lang: (lang_id: string) => void;
}

export function LangModal_FOOTER({
  selectedLang_IDS = [],

  loading = false,
  cancel = () => {},
  submit = async () => {},
  SELECT_lang = () => {},
}: LangModalFooter_PROPS) {
  const appLang = useMemo(() => i18next.language, []);

  const { target_LANGS: selected_LANGS } = USE_getTargetLangs({
    targetLang_IDS: selectedLang_IDS,
  });

  const text = useMemo(() => {
    if (loading) return "";
    if (appLang === "en") return `Select ${selected_LANGS?.length} languages`;
    if (appLang === "de") return `${selected_LANGS?.length} Sprachen wählen`;
    return t("btn.selectLangs");
  }, [loading, appLang, selected_LANGS]);

  return (
    <TwoBtn_BLOCK
      contentAbove={
        <SelectedLang_SCROLLER
          selected_LANGS={selected_LANGS}
          REMOVE_lang={SELECT_lang}
        />
      }
      btnLeft={<Btn text={t("btn.cancel")} onPress={cancel} />}
      btnRight={
        <Btn
          text={text}
          onPress={async () => {
            if (!loading) await submit();
          }}
          iconRight={loading ? <ActivityIndicator color="black" /> : null}
          type="action"
          stayPressed={loading}
          style={{ flex: 1 }}
        />
      }
    />
  );
}
