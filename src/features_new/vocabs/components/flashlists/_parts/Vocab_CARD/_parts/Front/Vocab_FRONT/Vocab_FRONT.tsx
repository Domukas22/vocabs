//
//
//

import Highlighted_TEXT from "@/src/components/1_grouped/texts/Highlighted_TEXT/Highlighted_TEXT";
import {
  ICON_markedStar,
  ICON_difficultyDot,
  ICON_flag,
  ICON_savedCount,
} from "@/src/components/1_grouped/icons/icons";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { MyColors } from "@/src/constants/MyColors";

import { t } from "i18next";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { privateOrPublic_TYPE } from "@/src/types/general_TYPES";
import { Vocab_TYPE, VocabTr_TYPE } from "@/src/features_new/vocabs/types";
import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";
import { vocabFetch_TYPES } from "@/src/features_new/vocabs/functions/FETCH_vocabs/types";
import {
  USE_getAppLangId,
  USE_getOneTargetLang,
} from "@/src/features_new/languages/hooks";

// 🔴🔴🔴 TODO ==> Finish refactoring Vocab_FRONT

interface VocabFront_PROPS {
  vocab: Vocab_TYPE;
  list_TYPE: privateOrPublic_TYPE;
  fetch_TYPE: vocabFetch_TYPES;
  highlighted?: boolean;
  TOGGLE_open: () => void;
}

export const Vocab_FRONT = React.memo(function Vocab_FRONT({
  TOGGLE_open,
  highlighted = false,
  fetch_TYPE = "all",
  list_TYPE = "public",
  vocab,
}: VocabFront_PROPS) {
  const { appearance } = z_USE_myVocabsDisplaySettings();

  const {
    SHOW_description = false,
    SHOW_difficulty = false,
    SHOW_flags = false,
    frontTrLang_ID = "en",
  } = appearance;

  const { trs, difficulty, description, is_marked, saved_count = 0 } = vocab;

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
        <VocabCardFront_TR vocab={vocab} frontTrLang_ID={frontTrLang_ID} />
        <VocabCardFront_DESC
          vocab={vocab}
          SHOW_description={SHOW_description}
        />

        <View
          style={{
            flexDirection: "row",
            marginTop: 12,
            justifyContent: "flex-end",
          }}
        >
          {list_TYPE === "public" && <ICON_savedCount count={saved_count} />}

          {(SHOW_flags || SHOW_difficulty || is_marked) && (
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
                  {is_marked && <ICON_markedStar color="green" size="tiny" />}
                </>
              )}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
});

function VocabCardFront_DESC({
  vocab,
  SHOW_description = false,
}: {
  vocab: Vocab_TYPE;
  SHOW_description: boolean;
}) {
  const { description = "" } = vocab;

  return description && SHOW_description ? (
    <Styled_TEXT type="label_small">{description}</Styled_TEXT>
  ) : null;
}

function VocabCardFront_TR({
  frontTrLang_ID = "en",
  vocab,
}: {
  frontTrLang_ID: string;
  vocab: Vocab_TYPE;
}) {
  const { trs = [] } = vocab;
  const { target_LANG } = USE_getOneTargetLang({
    targetLang_ID: frontTrLang_ID,
  });
  const { appLang_ID } = USE_getAppLangId();

  const frontTr_OBJ = useMemo(
    () =>
      trs?.find(
        (tr) =>
          tr.lang_id === frontTrLang_ID &&
          tr.text !== "" &&
          tr.text !== undefined &&
          tr.text !== null
      ),
    [trs, frontTrLang_ID]
  );

  return frontTr_OBJ?.text &&
    frontTr_OBJ?.lang_id &&
    frontTr_OBJ?.highlights ? (
    <Highlighted_TEXT
      text={frontTr_OBJ?.text}
      highlights={frontTr_OBJ?.highlights || []}
      diff={vocab.type === "private" ? vocab?.difficulty : 0}
    />
  ) : (
    <Label>
      {t("label.missingTranslation") +
        " " +
        target_LANG?.[`lang_in_${appLang_ID}`]}
    </Label>
  );
}

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
