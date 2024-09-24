//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { StyleSheet, View } from "react-native";

import {
  Vocab_MODEL,
  List_MODEL,
  Translation_MODEL,
  PublicVocab_MODEL,
  PublicDisplaySettings_MODEL,
} from "@/src/db/models";

import PrivateVocab_FRONT from "../Private_VOCAB/components/PrivateVocab_FRONT";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import { DisplaySettings_MODEL } from "@/src/db/models";

import PublicVocab_BACK from "./components/PublicVocab_BACK";
import PublicVocab_FRONT from "./components/PublicVocab_FRONT";

interface VocabProps {
  vocab: PublicVocab_MODEL;
  displaySettings: PublicDisplaySettings_MODEL;
  HANDLE_vocabModal: ({
    clear,
    vocab,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
  }) => void;
  IS_admin: boolean;
  PREPARE_toSaveVocab: (vocab: Vocab_MODEL) => void;
}

// TOGGLE_vocabModal needs to also pass in th etranslations, so we dont have to pass them async and get a delayed manageVocabModal update
export default function PublicVocab({
  vocab,
  displaySettings,
  HANDLE_vocabModal,
  IS_admin,
  PREPARE_toSaveVocab,
}: VocabProps) {
  const [open, TOGGLE_vocab] = USE_toggle(false);

  return (
    <View
      style={[
        s.vocab,
        open && s.vocab_open,
        open && { borderColor: MyColors.border_primary },
      ]}
    >
      <View>
        <PublicVocab_FRONT
          visible={!open}
          vocab={vocab}
          displaySettings={displaySettings}
          onPress={TOGGLE_vocab}
        />
        {open ? (
          <PublicVocab_BACK
            vocab={vocab}
            TOGGLE_vocab={TOGGLE_vocab}
            HANDLE_vocabModal={HANDLE_vocabModal}
            IS_admin={IS_admin}
            PREPARE_toSaveVocab={PREPARE_toSaveVocab}
          />
        ) : null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  vocab: {
    borderRadius: 12,
    backgroundColor: MyColors.btn_2,
    borderWidth: 1,
    borderColor: MyColors.border_white_005,
    overflow: "hidden",
  },
  vocab_open: {
    backgroundColor: MyColors.fill_bg,
  },

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
