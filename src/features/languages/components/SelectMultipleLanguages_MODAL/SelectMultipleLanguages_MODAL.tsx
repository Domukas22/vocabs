//
//
//

import React, { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

import Big_MODAL from "@/src/components/1_grouped/modals/Big_MODAL/Big_MODAL";

import { Lang_FLATLIST } from "../Lang_FLATLIST/Lang_FLATLIST";
import { LangModal_FOOTER } from "../LangModal_FOOTER/LangModal_FOOTER";
import { LangModal_HEADER } from "../LangModal_HEADER/LangModal_HEADER";
import { USE_selectedLangs } from "../../functions";
import SearchAndSelect_SUBHEADER from "@/src/components/1_grouped/subheader/variations/SearchAndSelect_SUBHEADER/SearchAndSelect_SUBHEADER";
import { General_ERROR } from "@/src/types/error_TYPES";
import {
  USE_getTargetLangs,
  USE_searchedLangs,
} from "@/src/features_new/languages/hooks";
import { t } from "i18next";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";

interface SelectLanguagesModal_PROPS {
  open: boolean;
  error?: General_ERROR | undefined;
  loading?: boolean;
  initialLang_IDS?: string[] | undefined;
  CLOSE_modal: () => void;
  SUBMIT_langIds: (lang_ids: string[]) => Promise<void>;
}

export function SelectMultipleLanguages_MODAL({
  open = false,
  error,
  loading = false,
  initialLang_IDS = [],
  CLOSE_modal,
  SUBMIT_langIds = async () => {},
}: SelectLanguagesModal_PROPS) {
  const [search, SET_search] = useState("");

  const [selectedLang_IDS, SET_selectedLangIds] =
    useState<string[]>(initialLang_IDS);

  useEffect(() => {
    SET_selectedLangIds(initialLang_IDS);
  }, [initialLang_IDS]);

  const SELECT_lang = useCallback((lang_id: string) => {
    SET_selectedLangIds((prev) =>
      prev.includes(lang_id)
        ? prev.filter((id) => id !== lang_id)
        : [...prev, lang_id]
    );
    SET_search("");
  }, []);

  const cancel = () => {
    CLOSE_modal();
    SET_search("");
  };

  const submit = async () => await SUBMIT_langIds(selectedLang_IDS);

  return (
    <Big_MODAL {...{ open }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: "100%" }}
      >
        <LangModal_HEADER IS_inAction={loading} cancel={cancel} />
        <SearchAndSelect_SUBHEADER search={search} SET_search={SET_search} />

        <Lang_FLATLIST
          search={search}
          SELECT_lang={SELECT_lang}
          selectedLang_IDS={selectedLang_IDS}
        />

        <LangModal_FOOTER
          loading={loading}
          selectedLang_IDS={selectedLang_IDS}
          cancel={cancel}
          submit={submit}
          SELECT_lang={SELECT_lang}
        />
      </KeyboardAvoidingView>
    </Big_MODAL>
  );
}
