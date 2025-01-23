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

interface LangModalFooter_PROPS {
  selected_LANGS: Language_MODEL[] | undefined;
  IS_inAction?: boolean | undefined;
  cancel: () => void;
  submit: () => Promise<void>;
  SELECT_lang: (l: Language_MODEL) => void;
  SUBMIT_langIds: (lang_ids: string[]) => void;
}

export function LangModal_FOOTER({
  selected_LANGS,
  IS_inAction,
  cancel,
  submit = async () => {},
  SELECT_lang,
  SUBMIT_langIds,
}: LangModalFooter_PROPS) {
  const appLang = useMemo(() => i18next.language, []);
  return (
    <TwoBtn_BLOCK
      contentAbove={
        <SelectedLang_SCROLLER
          {...{ selected_LANGS }}
          REMOVE_lang={SELECT_lang}
        />
      }
      btnLeft={
        <Btn
          text={t("btn.cancel")}
          onPress={() => {
            if (!IS_inAction) cancel();
          }}
        />
      }
      btnRight={
        appLang === "en" ? (
          <Btn
            text={
              !IS_inAction ? `Select ${selected_LANGS?.length} languages` : ""
            }
            onPress={async () => {
              await submit();
            }}
            iconRight={IS_inAction ? <ActivityIndicator color="black" /> : null}
            type="action"
            style={{ flex: 1 }}
          />
        ) : (
          <Btn
            text={
              !IS_inAction ? `${selected_LANGS?.length} Sprachen wählen` : ""
            }
            onPress={async () => {
              if (!IS_inAction) await submit();
            }}
            iconRight={IS_inAction ? <ActivityIndicator color="black" /> : null}
            type="action"
            stayPressed={IS_inAction}
            style={{ flex: 1 }}
          />
        )
      }
    />
  );
}
