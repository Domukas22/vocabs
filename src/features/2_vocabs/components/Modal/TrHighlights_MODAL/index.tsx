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
import Language_MODEL from "@/src/db/models/Language_MODEL";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";

import Subnav from "@/src/components/Subnav/Subnav";
import GET_letterBtns from "./GET_letterBtns/GET_letterBtns";
import GET_wordBtns from "./GET_wordBtns/GET_wordBtns";

interface TrHighlightsModal_PROPS {
  open: boolean;
  tr: tr_PROPS | undefined;
  target_LANG: Language_MODEL | undefined;
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
  target_LANG,
  tr,
  diff,
  TOGGLE_open,
  SUBMIT_highlights,
}: TrHighlightsModal_PROPS) {
  const { t } = useTranslation();
  const appLang = useMemo(() => i18next.language, []);

  const [highlights, SET_highlights] = useState(
    tr?.highlights.map(Number) || []
  );

  function submit() {
    SUBMIT_highlights({ lang_id: target_LANG?.lang_id || "", highlights });

    TOGGLE_open();
  }

  useEffect(() => {
    SET_highlights(tr?.highlights.map(Number) || []);
  }, [tr, open]);

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

      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Label
          icon={<ICON_flag lang={target_LANG?.lang_id} />}
          styles={{ marginBottom: 12 }}
        >
          {appLang === "en"
            ? `${target_LANG?.lang_in_en} ${t("word.highlights")}`
            : `${t("word.highlights")} auf ${target_LANG?.lang_in_de}`}
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
