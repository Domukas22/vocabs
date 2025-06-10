//
//
//

//
//
//

import React, { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { MyColors } from "@/src/constants/MyColors";
import { z_USE_langs } from "@/src/features_new/languages/hooks";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_flag,
  ICON_checkMark,
  ICON_X,
  ICON_reload,
  ICON_arrow2,
  ICON_edit,
  ICON_markedStar,
  ICON_toastNotification,
} from "@/src/components/1_grouped/icons/icons";
import Highlighted_TEXT from "@/src/components/1_grouped/texts/Highlighted_TEXT/Highlighted_TEXT";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { t } from "i18next";
import { Flashcards_NAV } from "@/src/features_new/vocabs/components/navs/Flashcards_NAV/Flashcards_NAV";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { Lang_TYPE } from "@/src/features_new/languages/types";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";

type displayMode_TYPE = "hidden" | "remembered" | "forgot";

export default function Flashcards_PAGE() {
  const text =
    "They say I am very hard to remember asd adwawdawdawd awd awd awdanwdaw n awndawdaw dnawdnawd nawndwad ";
  const highlights = [14, 15, 16, 17, 18, 19, 20, 21, 22];
  const lang_ids = ["de", "lt"];

  const { z_GET_langsByLangId } = z_USE_langs();

  const langs = useMemo(() => z_GET_langsByLangId(lang_ids), [lang_ids]);
  const selected_LANGS = ["en", "de"];
  const front_LANG = "en";
  const difficulty_FILTERS = [];
  const loading = false;

  const vocab = {
    difficulty: 2,
    trs: [
      {
        text: "They say I am very hard to remember asd  awd awd awdanwdaw n awndawdaw dnawdnawd nawndwad ",
        highlights: [14, 15, 16, 17, 18, 19, 20, 21, 22],
        lang_id: "en",
      },
      {
        text: "Jie sako mane sunkuprisiminti",
        highlights: [14, 15, 16, 17, 18, 19, 20, 21, 22],
        lang_id: "lt",
      },
      {
        text: "Die sagen, dass es hart ist mich zu merken",
        highlights: [14, 15, 16, 17, 18, 19, 20, 21, 22],
        lang_id: "de",
      },
    ],
  } as unknown as Vocab_TYPE;

  const [display_MODE, SET_displayMode] = useState<displayMode_TYPE>("hidden");

  if (loading)
    return (
      <>
        <Flashcards_NAV
          OPEN_displaySettings={() => {}}
          IS_reloadDisabled={loading}
        />

        <View
          style={{
            flex: 1,
            backgroundColor: MyColors.fill_bg,
            justifyContent: "center",
          }}
        >
          <ActivityIndicator color={MyColors.icon_gray_light} />
        </View>
      </>
    );

  return (
    <>
      <Flashcards_NAV
        OPEN_displaySettings={() => {}}
        IS_reloadDisabled={loading}
      />

      <ScrollView
        style={{
          backgroundColor: MyColors.fill_bg,
          paddingTop: 40,
        }}
      >
        {display_MODE === "hidden" && (
          <VocabHiddenFlashcard_CONTENT
            langs={langs}
            vocab={vocab}
            SET_displayMode={SET_displayMode}
          />
        )}
        {(display_MODE === "remembered" || display_MODE === "forgot") && (
          <>
            <View
              style={{
                borderWidth: 1,
                borderColor:
                  display_MODE === "remembered"
                    ? MyColors.border_green
                    : MyColors.border_red,
              }}
            >
              {vocab.trs?.map((tr, i) => {
                return (
                  <View
                    style={[
                      {
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        flexDirection: "row",
                        gap: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: MyColors.border_white_005,
                      },
                    ]}
                    key={tr.lang_id + i}
                  >
                    <ICON_flag lang={tr.lang_id} big style={{ marginTop: 7 }} />
                    <View style={{ flex: 1 }}>
                      <Highlighted_TEXT
                        text={tr.text}
                        highlights={tr.highlights}
                        diff={display_MODE === "remembered" ? 4 : 5}
                        big
                      />
                    </View>
                  </View>
                );
              })}
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor:
                    display_MODE === "remembered"
                      ? MyColors.border_green
                      : MyColors.border_red,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  flexDirection: "row",
                  gap: 8,
                }}
              >
                <ICON_toastNotification
                  type={display_MODE === "remembered" ? "success" : "error"}
                  style={{ marginTop: 1 }}
                />
                <Styled_TEXT
                  style={{
                    color:
                      display_MODE === "remembered"
                        ? MyColors.text_green
                        : MyColors.text_red,
                    fontFamily: "Nunito-Medium",
                  }}
                >
                  {display_MODE === "remembered"
                    ? t("label.rememberedVocab")
                    : t("label.forgotVocab")}
                </Styled_TEXT>
              </View>
            </View>

            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: MyColors.border_white_005,
                gap: 8,
              }}
            >
              <Btn
                text={t("btn.seeNextVocab")}
                iconRight={<ICON_arrow2 direction="right" color="primary" />}
                text_STYLES={{ flex: 1 }}
                type="simple_primary_text"
              />
              <Btn
                text={t("btn.markVocab")}
                iconRight={<ICON_markedStar color="white" />}
                text_STYLES={{ flex: 1 }}
              />
              <Btn
                text={t("btn.editVocab")}
                iconRight={<ICON_edit color="white" />}
                text_STYLES={{ flex: 1 }}
              />
              <Btn
                text={t("btn.undoFlashcardSelection")}
                iconRight={<ICON_X color="white" rotate big />}
                text_STYLES={{ flex: 1 }}
                onPress={() => SET_displayMode("hidden")}
              />
            </View>
          </>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
      {display_MODE === "hidden" && (
        <VocabFlashcardBottomReload_BTN primary={false} />
      )}
    </>
  );
}

////////////////////////////////////////////////////////////////

function VocabHiddenFlashcard_CONTENT({
  vocab,
  langs = [],
  SET_displayMode,
}: {
  vocab: Vocab_TYPE;
  langs: Lang_TYPE[];
}) {
  return (
    <>
      <Label styles={{ paddingHorizontal: 16, paddingTop: 8 }}>
        {t("label.doYouRememberThisVocab")}
      </Label>
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: MyColors.border_white_005,
        }}
      >
        <VocabFlashcardHighlighted_TEXT vocab={vocab} />
        <VocabFlashcardHiddenLang_BLOCK langs={langs} />
      </View>

      <VocabFlashcardAnswerButton_WRAP SET_displayMode={SET_displayMode} />
    </>
  );
}
function VocabFlashcardHighlighted_TEXT({ vocab }: { vocab: Vocab_TYPE }) {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 4,
      }}
    >
      <Highlighted_TEXT
        text={vocab.trs[0].text}
        highlights={vocab.trs[0].highlights}
        diff={vocab.difficulty}
        big
      />
    </View>
  );
}
function VocabFlashcardHiddenLang_BLOCK({
  langs = [],
}: {
  langs: Lang_TYPE[];
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: MyColors.border_white_005,
      }}
    >
      {langs?.map((l) => (
        <View
          key={l.id}
          style={{
            // borderColor: MyColors.border_white_005,
            // borderWidth: 1,
            // paddingVertical: 2,
            // paddingHorizontal: 8,
            marginRight: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            borderRadius: 8,
          }}
        >
          <ICON_flag lang={l.lang_id} big style={{ marginBottom: 2 }} />
          <Styled_TEXT type="text_15_bold">
            {l.lang_id.toUpperCase() + " ?"}
          </Styled_TEXT>
        </View>
      ))}
    </View>
  );
}
function VocabFlashcardAnswerButton_WRAP({
  SET_displayMode,
}: {
  SET_displayMode;
}) {
  return (
    <View
      style={{
        gap: 8,
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: MyColors.border_white_005,
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      <Btn
        text={t("btn.yesIRemember")}
        iconRight={<ICON_checkMark color="green" />}
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
        type="sub_green"
        onPress={() => SET_displayMode("remembered")}
      />
      <Btn
        text={t("btn.noIForgot")}
        iconRight={<ICON_X rotate color="red" big />}
        style={{ flex: 1 }}
        text_STYLES={{ flex: 1 }}
        type="sub_red"
      />
    </View>
  );
}
function VocabFlashcardBottomReload_BTN({
  primary = false,
}: {
  primary: boolean;
}) {
  return (
    <View
      style={{
        gap: 8,

        borderTopWidth: 1,
        borderTopColor: MyColors.border_white_005,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: MyColors.fill_bg,
      }}
    >
      <Btn
        text={t("btn.fetchAnotherFlashcardVocab")}
        iconRight={<ICON_reload color={primary ? "primary" : "white"} />}
        text_STYLES={{
          flex: 1,
          color: primary ? MyColors.text_primary : MyColors.text_white,
        }}
      />
    </View>
  );
}

////////////////////////////////////////////////////////////////

type Flashcard_CONTROLLER = {
  fetchedVocabs: Array<Vocab_TYPE>;
  seenIds: Set<string>; // grows over time
  currentIndex: number; // e.g., 2 (points to vocab11)
  isHidden: boolean;
  feedback: null | "remembered" | "forgot";
  undoCache: Record<string, number>;
};
