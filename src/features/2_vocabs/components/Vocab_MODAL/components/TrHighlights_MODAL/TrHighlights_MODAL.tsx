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
import {
  GestureHandlerRootView,
  NativeViewGestureHandler,
  ScrollView,
} from "react-native-gesture-handler";
import { USE_langs } from "@/src/context/Langs_CONTEXT";

interface TrHighlightsModal_PROPS {
  open: boolean;
  tr: TranslationCreation_PROPS | undefined;
  diff: 0 | 1 | 2 | 3;
  TOGGLE_open: () => void;
  SET_trs: React.Dispatch<React.SetStateAction<TranslationCreation_PROPS[]>>;
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

  const [highlights, SET_highlights] = useState(tr?.highlights || []);

  function submit() {
    SUBMIT_highlights({ lang_id: lang?.id, highlights });

    TOGGLE_open();
  }

  useEffect(() => {
    SET_highlights(tr?.highlights || []);
  }, [tr]);

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
      <GestureHandlerRootView>
        <ScrollView style={{ flex: 1, padding: 16, gap: 8 }}>
          {appLang === "en" && (
            <Label icon={<ICON_flag lang={lang?.id} />}>{`${
              lang?.lang_in_en
            } ${t("word.highlights")}`}</Label>
          )}
          {appLang === "de" && (
            <Label icon={<ICON_flag lang={lang?.id} />}>{`${t(
              "word.highlights"
            )} auf ${lang?.lang_in_de}`}</Label>
          )}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
            {GET_highlightBtns({
              text: tr?.text || "",
              highlights: highlights,
              SEThighlights: SET_highlights,
              diff,
            })}
          </View>
        </ScrollView>
      </GestureHandlerRootView>

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

function GET_highlightBtns({
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
    Highlight_BTN({
      letter,
      index,
      active: highlights.includes(index),
      diff,
      HANDLE_index,
    })
  );
}

function Highlight_BTN({
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
          borderRadius: 4,
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
