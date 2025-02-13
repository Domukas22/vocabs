//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  ICON_arrow,
  ICON_bookmark_2,
  ICON_delete,
  ICON_difficultyDot,
  ICON_edit,
  ICON_restore,
  ICON_shuffle,
  ICON_X,
} from "@/src/components/1_grouped/icons/icons";

import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { Vocab_TYPE } from "@/src/features/vocabs/types";
import {
  vocabFetch_TYPES,
  vocabList_TYPES,
} from "@/src/features/vocabs/vocabList/USE_myVocabs/helpers/USE_fetchVocabs/helpers/FETCH_vocabs/types";
import { USE_toggle } from "@/src/hooks";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import VocabBackDifficultyEdit_BTNS from "../VocabBackDifficultyEdit_BTNS/VocabBackDifficultyEdit_BTNS";
import React from "react";
import { MyColors } from "@/src/constants/MyColors";

interface VocabBackBtns_PROPS {
  vocab: Vocab_TYPE;
  list_TYPE: vocabList_TYPES;
  fetch_TYPE: vocabFetch_TYPES;
  OPEN_vocabUpdateModal: () => void;
  OPEN_vocabCopyModal: () => void;
  OPEN_vocabPermaDeleteModal: () => void;
  TOGGLE_open: () => void;
  GO_toListOfVocab: () => void;
}
//
export default function VocabBack_BTNS({
  vocab,
  list_TYPE,
  fetch_TYPE,
  OPEN_vocabUpdateModal = () => {},
  OPEN_vocabCopyModal = () => {},
  OPEN_vocabPermaDeleteModal = () => {},
  TOGGLE_open = () => {},
  GO_toListOfVocab = () => {},
}: VocabBackBtns_PROPS) {
  const { t } = useTranslation();
  const toast = useToast();
  const [SHOW_difficultyEdits, TOGGLE_difficultyEdits, SET_difficultyEdit] =
    USE_toggle(false);

  const Edit_BTN = () => (
    <Btn
      type="simple"
      style={{ flex: 1 }}
      onPress={OPEN_vocabUpdateModal}
      text={t("btn.editVocab")}
      iconRight={<ICON_edit />}
      text_STYLES={{ marginRight: "auto" }}
    />
  );

  const ToggleMarked_BTN = () => (
    <Btn
      type={vocab?.is_marked ? "active_green" : "simple"}
      onPress={() => {
        (async () => {
          await vocab.TOGGLE_marked();
          if (vocab?.is_marked === true) {
            // only show when marked, dont show when unmarked
            toast.show(t("notifications.markedVocab"), {
              type: "success",
              duration: 2000,
            });
          }
        })();
      }}
      iconLeft={<ICON_bookmark_2 big active={vocab?.is_marked} />}
    />
  );

  const ToggleDifficulties_BTN = () => (
    <Btn
      type="simple"
      onPress={TOGGLE_difficultyEdits}
      iconLeft={
        <ICON_difficultyDot difficulty={vocab?.difficulty || 0} big={true} />
      }
    />
  );

  const VocabDifficulty_BTNS = () => (
    <VocabBackDifficultyEdit_BTNS
      active_DIFFICULTY={vocab?.difficulty}
      UPDATE_difficulty={(diff: 1 | 2 | 3) => {}}
      TOGGLE_open={TOGGLE_difficultyEdits}
    />
  );

  const Close_BTN = () => (
    <Btn
      type="simple"
      onPress={() => {
        TOGGLE_open();
        SET_difficultyEdit(false);
      }}
      text={t("btn.close")}
      iconRight={<ICON_X rotate big />}
      text_STYLES={{ marginRight: "auto" }}
    />
  );
  const GoToList_BTN = () => (
    <Btn
      type="simple"
      onPress={GO_toListOfVocab}
      text={t("btn.goToListOfVocab")}
      iconRight={<ICON_arrow direction="right" />}
      text_STYLES={{ marginRight: "auto" }}
    />
  );
  const Restore_BTN = () => (
    <Btn
      type="simple"
      onPress={GO_toListOfVocab}
      text={t("btn.restoreVocab")}
      iconRight={<ICON_restore />}
      text_STYLES={{ marginRight: "auto", color: MyColors.text_green }}
    />
  );
  const DeleteForever_BTN = () => (
    <Btn
      type="simple"
      onPress={GO_toListOfVocab}
      text={t("btn.deletePermanently")}
      iconRight={<ICON_delete />}
      text_STYLES={{ marginRight: "auto", color: MyColors.text_red }}
    />
  );
  const Copy_BTN = () => (
    <Btn
      type="simple"
      onPress={OPEN_vocabCopyModal}
      text={t("btn.saveVocab")}
      iconRight={<ICON_X color="primary" big />}
      text_STYLES={{ marginRight: "auto", color: MyColors.text_primary }}
    />
  );

  const MyVocab3Btn_WRAP = () =>
    SHOW_difficultyEdits ? (
      <VocabDifficulty_BTNS />
    ) : (
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Edit_BTN />
        <ToggleMarked_BTN />
        <ToggleDifficulties_BTN />
      </View>
    );

  const AllBtn_WRAP = ({ children }: { children: React.ReactNode }) => (
    <View style={{ padding: 12, gap: 8 }}>{children}</View>
  );

  if (list_TYPE === "private") {
    if (fetch_TYPE === "byTargetList") {
      return (
        <AllBtn_WRAP>
          <MyVocab3Btn_WRAP />
          <Close_BTN />
        </AllBtn_WRAP>
      );
    }
    if (fetch_TYPE === "all" || fetch_TYPE === "marked") {
      return (
        <AllBtn_WRAP>
          <MyVocab3Btn_WRAP />
          <GoToList_BTN />
          <Close_BTN />
        </AllBtn_WRAP>
      );
    }
    if (fetch_TYPE === "deleted") {
      return (
        <AllBtn_WRAP>
          <Restore_BTN />
          <DeleteForever_BTN />
          <Close_BTN />
        </AllBtn_WRAP>
      );
    }
  }

  return (
    <AllBtn_WRAP>
      <Copy_BTN />
      <Close_BTN />
    </AllBtn_WRAP>
  );
}
