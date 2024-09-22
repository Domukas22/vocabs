//
//
//

import { useEffect, useMemo, useRef, useState } from "react";
import Simple_MODAL from "../Simple_MODAL/Simple_MODAL";

import Btn from "../../Btn/Btn";
import { ICON_flag } from "../../icons/icons";
import Block from "../../Block/Block";
import StyledTextInput from "../../StyledTextInput/StyledTextInput";
import { USE_langs } from "@/src/context/Langs_CONTEXT";

interface TranslationTextModal_PROPS {
  text: string;
  lang_id: string;
  IS_open: boolean;
  TOGGLE_open: () => void;
  EDIT_tr: ({ lang_id, newText }: { lang_id: string; newText: string }) => void;
}

export default function TranslationText_MODAL({
  text,
  lang_id,
  IS_open,
  TOGGLE_open,
  EDIT_tr,
}: TranslationTextModal_PROPS) {
  const [_text, SET_text] = useState("");
  const [_lang_id, SET_langId] = useState("");
  const { languages } = USE_langs();
  const lang = languages.find((l) => l.id === lang_id);

  const inputREF = useRef(null);

  function SUBMIT_tr() {
    if (!lang || !lang.id) return;
    EDIT_tr({ lang_id: lang.id, newText: _text });
    TOGGLE_open();
    SET_text("");
  }

  useEffect(() => {
    if (IS_open) inputREF?.current?.focus();
    SET_text(IS_open ? text || "" : "");
    SET_langId(IS_open ? lang_id || "" : "");
  }, [IS_open]);

  return (
    <Simple_MODAL
      {...{
        title: "Edit translations",
        IS_open: IS_open,
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
        labelIcon={<ICON_flag lang={lang && lang.id} />}
        label={`${lang && lang.id} translation *`}
        styles={{ padding: 20 }}
      >
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
