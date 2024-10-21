//
//
//

import { useEffect, useMemo, useState } from "react";
import Btn from "@/src/components/Btn/Btn";
import { ICON_flag, ICON_X } from "@/src/components/icons/icons";
import { ScrollView, View } from "react-native";
import Header from "@/src/components/Header/Header";
import Footer from "@/src/components/Footer/Footer";
import Label from "@/src/components/Label/Label";
import { tr_PROPS } from "@/src/db/props";
import { Language_MODEL } from "@/src/db/watermelon_MODELS";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";

import { USE_langs } from "@/src/context/Langs_CONTEXT";
import Subnav from "@/src/components/Subnav/Subnav";

interface TrHighlightsModal_PROPS {
  open: boolean;
  tr: tr_PROPS | undefined;
  diff: 0 | 1 | 2 | 3;
  TOGGLE_open: () => void;
  SET_trs: (trs: tr_PROPS[]) => void;
  SUBMIT_highlights: ({
    lang_id,
    highlights,
  }: {
    lang_id: string;
    highlights: number[];
  }) => void;
}

export default function TrHighlights_MODAL({
  open,
  tr,
  diff,
  TOGGLE_open,
  SUBMIT_highlights,
}: TrHighlightsModal_PROPS) {
  const { languages } = USE_langs();
  const { t } = useTranslation();
  const appLang = useMemo(() => i18next.language, []);
  const lang = useMemo(() => languages.find((l) => l.id === tr?.lang_id), [tr]);

  const [highlights, SET_highlights] = useState(
    tr?.highlights.map(Number) || []
  );

  function submit() {
    SUBMIT_highlights({ lang_id: lang?.id, highlights });

    TOGGLE_open();
  }

  useEffect(() => {
    SET_highlights(tr?.highlights.map(Number) || []);
  }, [tr]);

  const [view, SET_view] = useState<"word" | "letter">("word");

  return (
    <Big_MODAL open={open && tr?.text !== ""}>
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
      <Subnav>
        <Btn
          text="By word"
          type={view === "word" ? "difficulty_1_active" : "simple"}
          onPress={() => SET_view("word")}
          style={{ flex: 1 }}
        />
        <Btn
          text="By letter"
          type={view === "letter" ? "difficulty_1_active" : "simple"}
          onPress={() => SET_view("letter")}
          style={{ flex: 1 }}
        />
      </Subnav>

      <ScrollView style={{ flex: 1, padding: 16, gap: 8 }}>
        <Label icon={<ICON_flag lang={lang?.id} />}>
          {appLang === "en"
            ? `${lang?.lang_in_en} ${t("word.highlights")}`
            : `${t("word.highlights")} auf ${lang?.lang_in_de}`}
        </Label>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
          {view === "letter"
            ? GET_letterBtns({
                text: tr?.text || "",
                highlights: highlights,
                SEThighlights: SET_highlights,
                diff,
              })
            : GET_wordBtns({
                text: tr?.text || "",
                highlights: highlights,
                SEThighlights: SET_highlights,
                diff,
              })}
        </View>
      </ScrollView>

      <Footer
        btnLeft={
          <Btn text={t("btn.cancel")} onPress={TOGGLE_open} type="simple" />
        }
        btnRight={
          <Btn
            text={t("btn.confirmSelection")}
            onPress={submit}
            type="action"
            style={{ flex: 1 }}
          />
        }
      />
    </Big_MODAL>
  );
}

function GET_letterBtns({
  text,
  highlights,
  diff,
  SEThighlights,
}: {
  text: string;
  highlights: number[];
  diff: 0 | 1 | 2 | 3;
  SEThighlights: React.Dispatch<React.SetStateAction<number[]>>;
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
    SEThighlights(updatedIndexes);
  }

  return text?.split("").map((letter, index) =>
    HighlightByLetter_BTN({
      letter,
      index,
      active: highlights.includes(index),
      diff,
      HANDLE_index,
    })
  );
}

function HighlightByLetter_BTN({
  letter,
  index,
  active,
  diff,
  HANDLE_index,
}: {
  letter: string;
  index: number;
  active: boolean;
  diff: 0 | 1 | 2 | 3;
  HANDLE_index: (index: number) => void;
}) {
  const btnType = () => {
    if (!active) return "simple";
    if (active && letter !== " ") return `difficulty_${diff || 3}_active`;

    return "simple";
  };

  return (
    <Btn
      key={"highlight btn" + index + letter}
      text={letter}
      type={btnType()}
      style={[
        {
          borderRadius: 8,
          width: "10%",
          paddingHorizontal: 0,
          paddingVertical: 0,
          height: 50,
        },
        letter === " " && { opacity: 0 },
      ]}
      onPress={() => {
        if (letter !== " ") {
          HANDLE_index(index);
        }
      }}
      text_STYLES={{ fontSize: 20, fontFamily: "Nunito-SemiBold" }}
    />
  );
}

function GET_wordBtns({
  text,
  highlights,
  diff,
  SEThighlights,
}: {
  text: string;
  highlights: number[];
  diff: 0 | 1 | 2 | 3;
  SEThighlights: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const words = text.split(" ");
  const wordOffsets = words.reduce((acc, word, idx) => {
    const start = idx === 0 ? 0 : acc[idx - 1].end + 1;
    acc.push({ start, end: start + word.length - 1 });
    return acc;
  }, [] as { start: number; end: number }[]);

  function HANDLE_word(index: number) {
    const { start, end } = wordOffsets[index];
    const allIndexes = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );

    let updatedIndexes: number[];
    const allHighlighted = allIndexes.every((i) => highlights.includes(i));

    if (allHighlighted) {
      // Remove all indexes of the word
      updatedIndexes = highlights.filter((i) => !allIndexes.includes(i));
    } else {
      // Add all indexes of the word
      updatedIndexes = [
        ...highlights,
        ...allIndexes.filter((i) => !highlights.includes(i)),
      ];
    }

    SEThighlights(updatedIndexes);
  }

  return words.map((word, index) =>
    HighlightByWord_BTN({
      word,
      index,
      active:
        wordOffsets[index].start >= 0 && wordOffsets[index].end >= 0
          ? wordOffsets[index].end + 1 - wordOffsets[index].start ===
            word
              .split("")
              .filter((_, i) =>
                highlights.includes(wordOffsets[index].start + i)
              ).length
          : false,
      diff,
      HANDLE_word,
    })
  );
}

function HighlightByWord_BTN({
  word,
  index,
  active,
  diff,
  HANDLE_word,
}: {
  word: string;
  index: number;
  active: boolean;
  diff: 0 | 1 | 2 | 3;
  HANDLE_word: (index: number) => void;
}) {
  const btnType = () => (active ? `difficulty_${diff || 3}_active` : "simple");

  return (
    <Btn
      key={"highlight word btn" + index + word}
      text={word}
      type={btnType()}
      style={{
        marginRight: 4,
        borderRadius: 8,
        paddingVertical: 0,
        height: 50,
      }}
      onPress={() => HANDLE_word(index)}
      text_STYLES={{ fontSize: 18, fontFamily: "Nunito-SemiBold" }}
    />
  );
}
