//
//
//

import Highlighted_TEXT from "@/src/components/1_grouped/texts/Highlighted_TEXT/Highlighted_TEXT";
import {
  ICON_markedStar,
  ICON_difficultyDot,
  ICON_download,
  ICON_downloadArrowOnly,
  ICON_flag,
  ICON_savedCount,
} from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { MyColors } from "@/src/constants/MyColors";

import Language_MODEL from "@/src/db/models/Language_MODEL";

import { USE_zustand } from "@/src/hooks";
import i18next, { t } from "i18next";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { itemVisibility_TYPE } from "@/src/types/general_TYPES";
import { VocabTr_TYPE } from "@/src/features_new/vocabs/types";
import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";

interface VocabFront_PROPS {
  trs: VocabTr_TYPE[] | undefined;
  difficulty: 0 | 1 | 2 | 3 | undefined;
  description: string | undefined;
  TOGGLE_open: () => void;
  highlighted?: boolean;
  IS_marked?: boolean;
  count: number;
  list_TYPE: itemVisibility_TYPE;
}

const Vocab_FRONT = React.memo(function Vocab_FRONT({
  trs,
  difficulty,
  description,
  TOGGLE_open,
  highlighted = false,
  IS_marked = false,
  count = 0,
  list_TYPE = "public",
}: VocabFront_PROPS) {
  const { appearance } = z_USE_myVocabsDisplaySettings();

  const {
    SHOW_description = false,
    SHOW_difficulty = false,
    SHOW_flags = false,
    frontTrLang_ID = "en",
  } = appearance;

  // Find the translation based on the selected language
  const front_TR = useMemo(() => {
    return trs && trs.length > 0
      ? trs?.find(
          (tr) =>
            tr.lang_id === frontTrLang_ID &&
            tr.text !== "" &&
            tr.text !== undefined &&
            tr.text !== null
        )
      : null;
  }, [trs, frontTrLang_ID]);

  return (
    <Pressable
      style={({ pressed }) => [
        s.parent,
        pressed && s.parentPressed,
        highlighted && s.parentHighlighted,
      ]}
      onPress={TOGGLE_open}
    >
      <View style={s.content}>
        {front_TR ? (
          <Highlighted_TEXT
            text={front_TR?.text || "EMPTY TRANSLATION"}
            highlights={front_TR?.highlights || []}
            diff={list_TYPE === "private" ? difficulty : 0}
          />
        ) : (
          <Label>{t("label.missingTranslation") + " " + frontTrLang_ID}</Label>
        )}
        {description && SHOW_description && (
          <Styled_TEXT type="label_small">{description}</Styled_TEXT>
        )}
        <View
          style={{
            flexDirection: "row",
            marginTop: 12,
            justifyContent: "flex-end",
          }}
        >
          {list_TYPE === "public" && <ICON_savedCount count={count} />}

          {(SHOW_flags || SHOW_difficulty || IS_marked) && (
            <View style={s.iconWrap}>
              <View style={{ flexDirection: "row", gap: 4 }}>
                {SHOW_flags &&
                  trs &&
                  trs.length > 0 &&
                  trs.map((tr) => (
                    <ICON_flag
                      key={"FrontFlag" + tr.lang_id}
                      lang={tr.lang_id}
                      big
                    />
                  ))}
              </View>
              {list_TYPE === "private" && (
                <>
                  {SHOW_difficulty && !!difficulty && (
                    <ICON_difficultyDot difficulty={difficulty} />
                  )}
                  {IS_marked && <ICON_markedStar color="green" size="tiny" />}
                </>
              )}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
});

export default Vocab_FRONT;

const s = StyleSheet.create({
  parent: {
    backgroundColor: MyColors.btn_2,
  },
  parentPressed: {
    backgroundColor: MyColors.btn_3,
  },
  parentHighlighted: {
    backgroundColor: MyColors.btn_green,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 12,
  },
  iconWrap: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  tagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagText: {
    fontSize: 14,
    fontFamily: "Nunito-Light",
    color: MyColors.text_white_06,
  },
});
