//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { Translation_MODEL, Vocab_MODEL } from "@/src/db/models";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import Btn from "../../Btn/Btn";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import languages from "@/src/constants/languages";
import { Styled_TEXT } from "../../StyledText/StyledText";
import RENDER_textWithHighlights from "../../RENDER_textWithHighlights/RENDER_textWithHighlights";
import { ICON_difficultyDot, ICON_flag, ICON_X } from "../../icons/icons";
import { GET_langFlagUrl } from "@/src/constants/globalVars";
import EDIT_vocabDifficulty from "@/src/db/vocabs/EDIT_vocabDifficulty";
import USE_editVocabDifficulty from "@/src/db/vocabs/EDIT_vocabDifficulty";

interface VocabBack_PROPS {
  vocab: Vocab_MODEL;
  selectedList_NAME: string;
  TOGGLE_vocab: () => void;
}

export default function Vocab_BACK({
  vocab,
  selectedList_NAME,
  TOGGLE_vocab,
}: VocabBack_PROPS) {
  const [SHOW_difficultyEdits, TOGGLE_difficultyEdits] = USE_toggle(false);

  const { EDIT_color, LOADING_colorEdit } = USE_editVocabDifficulty(() =>
    TOGGLE_difficultyEdits()
  );

  function HANDLE_editDifficulty(newDifficulty: 1 | 2 | 3) {
    if (!LOADING_colorEdit.loading && vocab.difficulty !== newDifficulty) {
      EDIT_color({ id: vocab.id, newDifficulty });
      // TOGGLE_difficultyEdits();
    }
  }

  return (
    <View>
      {vocab.translations?.map((tr, index) => (
        <View key={tr.text + vocab.id} style={s.bottomTr}>
          <View style={s.bottomVocabFlag_WRAP}>
            {/* <ICON_flag key={content.id + "/" + tr.lang} lang={tr.lang} /> */}
            {/* <Image
              style={{
                width: 24,
                height: 16,
                borderRadius: 2,
                marginRight: 4,
              }}
              // source={lang.image}
              source={{ uri: GET_langFlagUrl(tr.lang_id) }}
            /> */}
            <ICON_flag big={true} />
          </View>
          <Styled_TEXT
            type="vocabTitle"
            style={{ paddingVertical: 16, flex: 1 }}
          >
            <RENDER_textWithHighlights
              text={tr.text}
              highlights={tr.highlights}
              difficulty={vocab.difficulty}
            />
          </Styled_TEXT>
        </View>
      ))}
      <View style={s.bottomText_WRAP}>
        <Styled_TEXT type="label_small">{selectedList_NAME}</Styled_TEXT>
        <Styled_TEXT type="label_small">{vocab.description}</Styled_TEXT>
      </View>
      <View
        style={{
          padding: 12,
        }}
      >
        {!SHOW_difficultyEdits && (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Btn
              type="simple"
              style={{ flex: 1 }}
              // onPress={() => EDIT_vocab({ vocab, translations })}
              onPress={() => {}}
              text="Edit vocab"
              text_STYLES={{ textAlign: "center" }}
            />

            <Btn type="simple" onPress={TOGGLE_vocab} text="Close" />

            <Btn
              type="simple"
              onPress={TOGGLE_difficultyEdits}
              iconLeft={
                <ICON_difficultyDot difficulty={vocab.difficulty} big={true} />
              }
            />
          </View>
        )}
        {SHOW_difficultyEdits && (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Btn
              type={vocab.difficulty === 1 ? "difficulty_1_active" : "simple"}
              style={{ flex: 1 }}
              onPress={() => HANDLE_editDifficulty(1)}
              iconLeft={
                LOADING_colorEdit.loading &&
                LOADING_colorEdit.difficulty === 1 ? (
                  <ActivityIndicator color={MyColors.icon_difficulty_1} />
                ) : (
                  <ICON_difficultyDot difficulty={1} big={true} />
                )
              }
            />

            <Btn
              type={vocab.difficulty === 2 ? "difficulty_2_active" : "simple"}
              style={{ flex: 1 }}
              onPress={() => HANDLE_editDifficulty(2)}
              iconLeft={
                LOADING_colorEdit.loading &&
                LOADING_colorEdit.difficulty === 2 ? (
                  <ActivityIndicator color={MyColors.icon_difficulty_2} />
                ) : (
                  <ICON_difficultyDot difficulty={2} big={true} />
                )
              }
            />

            <Btn
              type={vocab.difficulty === 3 ? "difficulty_3_active" : "simple"}
              style={{ flex: 1 }}
              onPress={() => HANDLE_editDifficulty(3)}
              iconLeft={
                LOADING_colorEdit.loading &&
                LOADING_colorEdit.difficulty === 3 ? (
                  <ActivityIndicator color={MyColors.icon_difficulty_3} />
                ) : (
                  <ICON_difficultyDot difficulty={3} big={true} />
                )
              }
            />
            <Btn
              type="simple"
              onPress={TOGGLE_difficultyEdits}
              iconLeft={<ICON_X big={true} rotate={true} />}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  bottomTr: {
    flexDirection: "row",
    minHeight: 60,
    borderBottomWidth: 1,
    borderColor: MyColors.border_white_005,
  },
  bottomVocabFlag_WRAP: {
    justifyContent: "center",
    alignItems: "center",
    height: 58,
    width: 50,
  },
  bottomVocab_TITLE: {
    color: MyColors.text_white,
    fontSize: 18,
    fontWeight: 500,
    paddingVertical: 16,
    flex: 1,
  },
  bottomText_WRAP: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: MyColors.border_white_005,
  },
});
