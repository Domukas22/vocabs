//
//
//

import React, { useEffect, useMemo, useRef, useState } from "react";
import Small_MODAL from "@/src/components/Modals/Small_MODAL/Small_MODAL";

import Btn from "@/src/components/Btn/Btn";
import { ICON_flag } from "@/src/components/icons/icons";

import StyledText_INPUT from "@/src/components/StyledText_INPUT/StyledText_INPUT";
import GET_highlightsWithoutOverflow from "@/src/utils/GET_highlightsWithoutOverflow";
import { Language_MODEL, TranslationCreation_PROPS } from "@/src/db/models";
import Label from "@/src/components/Label/Label";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { KeyboardAvoidingView, Platform } from "react-native";

interface TrTextModal_PROPS {
  open: boolean;
  TOGGLE_open: () => void;
  target_LANG: Language_MODEL | undefined;
  modal_TRs: TranslationCreation_PROPS[];
  SET_modalTRs: React.Dispatch<
    React.SetStateAction<TranslationCreation_PROPS[]>
  >;
  TOGGLE_highlightModal: () => void;
}

export default function TrText_MODAL({
  target_LANG,
  open,
  TOGGLE_open,
  modal_TRs,
  SET_modalTRs,
  TOGGLE_highlightModal = () => {},
}: TrTextModal_PROPS) {
  const appLang = useMemo(() => i18next.language, []);
  const { t } = useTranslation();
  const [_text, SET_text] = useState("");
  const [_lang, SET_lang] = useState<Language_MODEL | undefined>(null);

  const inputREF = useRef(null);

  useEffect(() => {
    if (open) inputREF?.current?.focus();

    const text =
      modal_TRs?.find((tr) => tr.lang_id === target_LANG?.id)?.text || "";

    SET_text(open ? text || "" : "");
    SET_lang(open ? target_LANG : null);
  }, [open]);

  function SUBMIT_tr() {
    if (!_lang || !_lang.id) return;
    EDIT_trText({ lang_id: _lang.id, newText: _text });
    TOGGLE_open();
    SET_text("");
  }

  function EDIT_trText({
    lang_id,
    newText,
  }: {
    lang_id: string;
    newText: string;
  }) {
    if (!modal_TRs) return;
    const newTRs = modal_TRs.map((tr) => {
      if (tr && tr.lang_id && tr.lang_id === lang_id) {
        tr.text = newText;

        if (tr.highlights?.length > 0) {
          tr.highlights = GET_highlightsWithoutOverflow({
            text: newText,
            highlights: tr.highlights,
          });
        }
      }

      return tr;
    });
    SET_modalTRs(newTRs);
  }

  return (
    <Small_MODAL
      {...{
        title: t("modal.editTr.header"),
        IS_open: open,
        TOGGLE_modal: () => {
          SET_text(""), TOGGLE_open();
        },
        btnLeft: (
          <Btn
            text={t("btn.cancel")}
            onPress={() => {
              SET_text(""), TOGGLE_open();
            }}
          />
        ),
        btnRight: (
          <Btn
            text={t("btn.save")}
            onPress={SUBMIT_tr}
            style={{ flex: 1 }}
            type={_text === "" ? "action" : "simple"}
          />
        ),
        btnUpper: _text !== "" && (
          <Btn
            text={t("btn.saveAndGoTohighlights")}
            onPress={() => {
              SUBMIT_tr();
              TOGGLE_highlightModal();
            }}
            type="action"
          />
        ),
      }}
    >
      {appLang === "en" && (
        <Label icon={<ICON_flag lang={_lang?.id} />}>{`${_lang?.lang_in_en} ${t(
          "word.translation"
        )} *`}</Label>
      )}
      {appLang === "de" && (
        <Label icon={<ICON_flag lang={_lang?.id} />}>{`${t(
          "word.translation"
        )} auf ${_lang?.lang_in_de}`}</Label>
      )}
      <StyledText_INPUT
        multiline={true}
        value={_text}
        SET_value={SET_text}
        // placeholder={t("placeholder.translation")}
        _ref={inputREF}
      />
    </Small_MODAL>
  );
}
