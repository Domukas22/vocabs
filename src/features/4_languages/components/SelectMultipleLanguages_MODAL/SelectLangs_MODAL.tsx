//
//
//

import React, { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";

import Lang_FLATLIST from "../Lang_FLATLIST/Lang_FLATLIST";
import LangModal_FOOTER from "./LangModal_FOOTER/LangModal_FOOTER";
import LangModal_HEADER from "./LangModal_HEADER/LangModal_HEADER";
import USE_selectedLangs from "../../hooks/USE_selectedLangs";
import SearchAndSelect_SUBNAV from "@/src/components/SearchAndSelect_SUBNAV/SearchAndSelect_SUBNAV";

interface SelectLanguagesModal_PROPS {
  open: boolean;
  lang_ids?: string[] | undefined;
  IS_inAction?: boolean;
  TOGGLE_open: () => void;
  SUBMIT_langIds: (lang_ids: string[]) => Promise<void>;
}

export default function SelectLangs_MODAL({
  open = false,
  lang_ids = [],
  IS_inAction = false,
  TOGGLE_open,
  SUBMIT_langIds = async () => {},
}: SelectLanguagesModal_PROPS) {
  const [search, SET_search] = useState("");

  const { selected_LANGS, SELECT_lang } = USE_selectedLangs({
    lang_ids,
    onSelect: () => SET_search(""),
  });

  const cancel = () => {
    TOGGLE_open();
    SET_search("");
  };

  const submit = async () => {
    await SUBMIT_langIds(selected_LANGS?.map((l) => l.lang_id) || []);
    SET_search("");
    TOGGLE_open();
  };

  const [view, SET_view] = useState<"all" | "selected">("all");

  return (
    <Big_MODAL {...{ open }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <LangModal_HEADER {...{ IS_inAction, cancel }} />
        <SearchAndSelect_SUBNAV
          {...{ view, SET_view, search, SET_search }}
          selected_COUNT={selected_LANGS.length}
        />

        <Lang_FLATLIST {...{ search, selected_LANGS, SELECT_lang, view }} />

        <LangModal_FOOTER
          {...{
            selected_LANGS,
            IS_inAction,
            cancel,
            submit,
            SELECT_lang,
            SUBMIT_langIds,
          }}
        />
      </KeyboardAvoidingView>
    </Big_MODAL>
  );
}
