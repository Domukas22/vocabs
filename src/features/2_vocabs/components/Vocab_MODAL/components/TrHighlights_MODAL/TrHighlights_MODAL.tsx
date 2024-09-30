//
//
//

import { useEffect, useMemo, useState } from "react";
import Btn from "@/src/components/Btn/Btn";
import { ICON_flag, ICON_X } from "@/src/components/icons/icons";
import { View } from "react-native";
import Header from "@/src/components/Header/Header";
import Footer from "@/src/components/Footer/Footer";
import Label from "@/src/components/Label/Label";
import { Language_MODEL, TranslationCreation_PROPS } from "@/src/db/models";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";

interface TrHighlightsModal_PROPS {
  open: boolean;
  TOGGLE_open: () => void;
  target_LANG: Language_MODEL | undefined;
  modal_DIFF: 0 | 1 | 2 | 3;
  modal_TRs: TranslationCreation_PROPS[];
  SET_modalTRs: React.Dispatch<
    React.SetStateAction<TranslationCreation_PROPS[]>
  >;
}

export default function TrHighlights_MODAL({
  target_LANG,
  open,
  TOGGLE_open,
  modal_DIFF,
  modal_TRs,
  SET_modalTRs,
}: TrHighlightsModal_PROPS) {
  const [_highlights, SET_highlights] = useState([]);
  const [_lang, SET_lang] = useState<Language_MODEL | undefined>(undefined);
  const text = modal_TRs?.find((tr) => tr.lang_id === target_LANG?.id)?.text;

  const { t } = useTranslation();
  const appLang = useMemo(() => i18next.language, []);

  function SUBMIT_highlights() {
    console.log(_lang);

    if (!_lang || !_lang.id) return;
    EDIT_trHighlights({ lang_id: _lang.id, newHighlights: _highlights });
    TOGGLE_open();
    SET_highlights([]);
  }

  useEffect(() => {
    SET_highlights(
      open
        ? modal_TRs?.find((tr) => tr.lang_id === target_LANG.id)?.highlights
        : []
    );

    SET_lang(open ? target_LANG : null);
  }, [open, modal_DIFF]);

  function EDIT_trHighlights({
    lang_id,
    newHighlights,
  }: {
    lang_id: string;
    newHighlights: number[];
  }) {
    if (!modal_TRs) return;
    const newTRs = modal_TRs.map((tr) => {
      if (tr.lang_id === lang_id) tr.highlights = newHighlights;
      return tr;
    });
    SET_modalTRs(newTRs);
  }

  return (
    <Big_MODAL open={open && text !== ""}>
      <Header
        title={t("modal.editHighlights.header")}
        big={true}
        btnRight={
          <Btn
            type="seethrough"
            iconLeft={<ICON_X big={true} rotate={true} />}
            onPress={TOGGLE_open}
            style={{ borderRadius: 100 }}
          />
        }
      />
      <View style={{ flex: 1, padding: 16, gap: 8 }}>
        {appLang === "en" && (
          <Label icon={<ICON_flag lang={_lang?.id} />}>{`${
            _lang?.lang_in_en
          } ${t("word.highlights")}`}</Label>
        )}
        {appLang === "de" && (
          <Label icon={<ICON_flag lang={_lang?.id} />}>{`${t(
            "word.highlights"
          )} auf ${_lang?.lang_in_de}`}</Label>
        )}
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {GET_highlightBtns({
            text,
            highlights: _highlights,
            SET_highlights,
            modal_DIFF,
          })}
        </View>
      </View>

      <Footer
        btnLeft={
          <Btn text={t("btn.cancel")} onPress={TOGGLE_open} type="simple" />
        }
        btnRight={
          <Btn
            text={t("btn.confirmSelection")}
            onPress={SUBMIT_highlights}
            type="action"
            style={{ flex: 1 }}
          />
        }
      />
    </Big_MODAL>
  );
}

function GET_highlightBtns({
  text,
  highlights,
  modal_DIFF,
  SET_highlights,
}: {
  text: string;
  highlights: number[];
  modal_DIFF: 0 | 1 | 2 | 3;
  SET_highlights: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  function HANDLE_index(index: number) {
    let updatedIndexes: number[];
    if (highlights.includes(index)) {
      // If index is already highlighted, remove it

      updatedIndexes = highlights?.filter((i) => i !== index);
    } else {
      // If index is not highlighted, add it
      updatedIndexes = [...highlights, index];
    }

    // Update the highlights state with the new string
    SET_highlights(updatedIndexes);
  }

  return text?.split("").map((letter, index) =>
    Highlight_BTN({
      letter,
      index,
      active: highlights.includes(index),
      modal_DIFF,
      HANDLE_index,
    })
  );
}

function Highlight_BTN({
  letter,
  index,
  active,
  modal_DIFF,
  HANDLE_index,
}: {
  letter: string;
  index: number;
  active: boolean;
  modal_DIFF: 0 | 1 | 2 | 3;
  HANDLE_index: (index: number) => void;
}) {
  const btnType = () => {
    if (!active) return "simple";
    if (active && modal_DIFF === 0) return "active";
    if (active && modal_DIFF === 1) return "difficulty_1_active";
    if (active && modal_DIFF === 2) return "difficulty_2_active";
    if (active && modal_DIFF === 3) return "difficulty_3_active";
    return "simple";
  };

  return (
    <Btn
      key={"highlight btn" + index + letter}
      text={letter}
      type={btnType()}
      style={{ borderRadius: 0, width: "10%", paddingHorizontal: 0 }}
      onPress={() => HANDLE_index(index)}
    />
  );
}
