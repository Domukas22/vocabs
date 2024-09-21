//
//
//

import { useEffect, useMemo, useState } from "react";
import Simple_MODAL from "../Simple_MODAL/Simple_MODAL";
import languages, { languagesArr_PROPS } from "@/src/constants/languages";
import Btn from "../../btn/btn";
import { ICON_flag, ICON_X } from "../../icons/icons";
import Block from "../../Block/Block";
import StyledTextInput from "../../StyledTextInput/StyledTextInput";
import { Styled_TEXT } from "../../Styled_TEXT";
import { Modal, SafeAreaView, View } from "react-native";
import { MyColors } from "@/src/constants/MyColors";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import Label from "../../Label/Label";

interface TranslationHighlightsModal_PROPS {
  text: string;
  highlights: string;
  lang_id: string;
  IS_open: boolean;
  TOGGLE_open: () => void;
  EDIT_trHighlights: ({
    lang_id,
    newHighlights,
  }: {
    lang_id: string;
    newHighlights: string;
  }) => void;
  difficulty: 1 | 2 | 3;
}

export default function TranslationHighlights_MODAL({
  text,
  highlights,
  lang_id,
  IS_open,
  TOGGLE_open,
  EDIT_trHighlights,
  difficulty,
}: TranslationHighlightsModal_PROPS) {
  const [_highlights, SET_highlights] = useState("");
  const [_lang_id, SET_langId] = useState("");
  const lang: languagesArr_PROPS = languages[lang_id];

  function SUBMIT_highlights() {
    if (!lang || !lang.id) return;
    EDIT_trHighlights({ lang_id: lang.id, newHighlights: _highlights });
    TOGGLE_open();
    SET_highlights("");
  }

  useEffect(() => {
    SET_highlights(IS_open ? highlights || "" : "");

    SET_langId(IS_open ? lang_id || "" : "");
  }, [IS_open, difficulty]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={IS_open && text !== ""}
      style={{}}
    >
      <SafeAreaView
        style={{
          backgroundColor: MyColors.fill_bg,

          flex: 1,
        }}
      >
        <Header
          title="Select a list"
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
          <Label
            labelIcon={<ICON_flag lang={lang?.id} />}
            labelText={`Select highlights ${lang?.lang?.en}`}
          />
          <Styled_TEXT>{text}</Styled_TEXT>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {GET_highlightBtns({
              text,
              highlights: _highlights,
              SET_highlights,
              difficulty,
            })}
          </View>
        </View>

        <Footer
          btnLeft={<Btn text="Cancel" onPress={TOGGLE_open} type="simple" />}
          btnRight={
            <Btn
              text="Save highlights"
              onPress={SUBMIT_highlights}
              type="action"
              style={{ flex: 1 }}
            />
          }
        />
      </SafeAreaView>
    </Modal>
  );
}

function GET_highlightBtns({
  text,
  highlights,
  difficulty,
  SET_highlights,
}: {
  text: string;
  highlights: string;
  difficulty: 1 | 2 | 3;
  SET_highlights: React.Dispatch<React.SetStateAction<string>>;
}) {
  const highlightedIndexes = highlights
    .split(",")
    .filter(Boolean) // prefents [0] if the highlights string is empty
    .map((index) => Number(index));

  function HANDLE_index(index: number) {
    let updatedIndexes: number[];
    if (highlightedIndexes.includes(index)) {
      // If index is already highlighted, remove it

      updatedIndexes = highlightedIndexes.filter((i) => i !== index);
    } else {
      // If index is not highlighted, add it
      updatedIndexes = [...highlightedIndexes, index];
    }

    // Update the highlights state with the new string
    SET_highlights(updatedIndexes.join(","));
  }

  return text?.split("").map((letter, index) =>
    Highlight_BTN({
      letter,
      index,
      active: highlightedIndexes.includes(index),
      difficulty,
      HANDLE_index,
    })
  );
}

function Highlight_BTN({
  letter,
  index,
  active,
  difficulty,
  HANDLE_index,
}: {
  letter: string;
  index: number;
  active: boolean;
  difficulty: 1 | 2 | 3;
  HANDLE_index: (index: number) => void;
}) {
  const btnType = () => {
    if (!active) return "simple";
    if (active && difficulty === 1) return "difficulty_1_active";
    if (active && difficulty === 2) return "difficulty_2_active";
    if (active && difficulty === 3) return "difficulty_3_active";
    return "simple";
  };

  return (
    <Btn
      text={letter}
      type={btnType()}
      style={{ borderRadius: 0, width: "10%", paddingHorizontal: 0 }}
      onPress={() => HANDLE_index(index)}
    />
  );
}
