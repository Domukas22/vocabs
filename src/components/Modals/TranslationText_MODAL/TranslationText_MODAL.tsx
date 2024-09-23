//
//
//

import React, { useEffect, useMemo, useRef, useState } from "react";
import Simple_MODAL from "../Simple_MODAL/Simple_MODAL";

import Btn from "../../Btn/Btn";
import { ICON_flag } from "../../icons/icons";
import Block from "../../Block/Block";
import StyledTextInput from "../../StyledTextInput/StyledTextInput";
import { USE_langs } from "@/src/context/Langs_CONTEXT";
import DELETE_overflowHighlights from "../ManageVocab_MODAL/helpers/DELETE_overflowHighlights";
import { Language_MODEL, TranslationCreation_PROPS } from "@/src/db/models";
import Label from "../../Label/Label";

interface TrTextModal_PROPS {
  open: boolean;
  TOGGLE_open: () => void;
  target_LANG: Language_MODEL | undefined;
  modal_TRs: TranslationCreation_PROPS[];
  SET_modalTRs: React.Dispatch<
    React.SetStateAction<TranslationCreation_PROPS[]>
  >;
}

export default function TrText_MODAL({
  target_LANG,
  open,
  TOGGLE_open,
  modal_TRs,
  SET_modalTRs,
}: TrTextModal_PROPS) {
  const [_text, SET_text] = useState("");
  const [_lang, SET_lang] = useState<Language_MODEL | undefined>(null);

  const inputREF = useRef(null);

  function SUBMIT_tr() {
    if (!_lang || !_lang.id) return;
    EDIT_trText({ lang_id: _lang.id, newText: _text });
    TOGGLE_open();
    SET_text("");
  }

  useEffect(() => {
    if (open) inputREF?.current?.focus();

    const text =
      modal_TRs?.find((tr) => tr.lang_id === target_LANG?.id)?.text || "";

    SET_text(open ? text || "" : "");
    SET_lang(open ? target_LANG : null);
  }, [open]);

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
          tr.highlights = DELETE_overflowHighlights({
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
    <Simple_MODAL
      {...{
        title: "Edit modal_TRs",
        open: open,
        toggle: () => {
          SET_text(""), TOGGLE_open();
        },
        btnLeft: (
          <Btn
            text="Cancel"
            onPress={() => {
              SET_text(""), TOGGLE_open();
            }}
            type="simple"
          />
        ),
        btnRight: (
          <Btn
            text="Save translation"
            onPress={SUBMIT_tr}
            type="action"
            style={{ flex: 1 }}
          />
        ),
      }}
    >
      <Block
        labelIcon={_lang?.id ? <ICON_flag lang={_lang.id} /> : null}
        label={`${_lang && _lang.id} translation *`}
        styles={{ padding: 20 }}
      >
        <Label icon={_lang?.id ? <ICON_flag lang={_lang.id} /> : null}>
          {`${_lang && _lang.lang_in_en} translation *`}
        </Label>
        <StyledTextInput
          multiline={true}
          value={_text}
          SET_value={SET_text}
          placeholder="Your vocab..."
          _ref={inputREF}
        />
      </Block>
    </Simple_MODAL>
  );
}
