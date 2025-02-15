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
import { View, Animated, Easing } from "react-native";
import { useToast } from "react-native-toast-notifications";
import VocabBackDifficultyEdit_BTNS from "../VocabBackDifficultyEdit_BTNS/VocabBackDifficultyEdit_BTNS";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MyColors } from "@/src/constants/MyColors";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { currentVocabAction_TYPE } from "@/src/app/(main)/vocabs/[list_id]";

interface VocabBackBtns_PROPS {
  vocab: Vocab_TYPE;
  list_TYPE: vocabList_TYPES;
  fetch_TYPE: vocabFetch_TYPES;
  OPEN_vocabUpdateModal: () => void;
  OPEN_vocabCopyModal: () => void;
  OPEN_vocabPermaDeleteModal: (vocab: Vocab_TYPE) => void;
  OPEN_vocabSoftDeleteModal: (vocab: Vocab_TYPE) => void;
  TOGGLE_open: () => void;
  GO_toListOfVocab: () => void;
  UPDATE_vocabDifficulty: (
    vocab_ID: string,
    new_DIFFICULTY: 1 | 2 | 3
  ) => Promise<void>;
  current_ACTIONS: currentVocabAction_TYPE[];
  UPDATE_vocabMarked: (vocab_ID: string, val: boolean) => Promise<void>;
}
//
export default function VocabBack_BTNS({
  vocab,
  list_TYPE,
  fetch_TYPE,
  OPEN_vocabUpdateModal = () => {},
  OPEN_vocabCopyModal = () => {},
  OPEN_vocabPermaDeleteModal = () => {},
  OPEN_vocabSoftDeleteModal = () => {},
  TOGGLE_open = () => {},
  GO_toListOfVocab = () => {},
  UPDATE_vocabDifficulty = () => Promise.resolve(),
  UPDATE_vocabMarked = () => Promise.resolve(),
  current_ACTIONS = [],
}: VocabBackBtns_PROPS) {
  const { t } = useTranslation();
  const toast = useToast();
  const [SHOW_difficultyEdits, TOGGLE_difficultyEdits, SET_difficultyEdit] =
    USE_toggle(false);

  const AllBtn_WRAP = ({ children }: { children: React.ReactNode }) => (
    <View style={{ padding: 12, gap: 8 }}>{children}</View>
  );

  const InlineBtn_WRAP = ({ children }: { children: React.ReactNode }) => (
    <View style={{ flexDirection: "row", gap: 8 }}>{children}</View>
  );

  const Edit_BTN = () => (
    <Btn
      type="simple"
      style={{ flex: 1 }}
      onPress={OPEN_vocabUpdateModal}
      text={t("btn.editVocab")}
      iconRight={<ICON_edit />}
      text_STYLES={{ marginRight: "auto" }}
    />
    // <Btn
    //   type="simple"
    //   style={{ flex: 1 }}
    //   onPress={OPEN_vocabUpdateModal}
    //   text={t("btn.editVocab")}
    //   iconRight={<ICON_edit />}
    //   text_STYLES={{ marginRight: "auto" }}
    // />
  );

  const IS_updatingMarked = useMemo(() => {
    return current_ACTIONS?.some(
      (action) => action.action === "updating_marked"
    );
  }, [current_ACTIONS]);

  const IS_vocabBeingDeleted = useMemo(() => {
    return current_ACTIONS?.some((action) => action.action === "deleting");
  }, [current_ACTIONS]);

  const ALLOW_action = useMemo(() => current_ACTIONS?.length === 0, []);

  const ToggleMarked_BTN = () => {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (IS_updatingMarked) {
        spinValue.setValue(0); // Reset animation
        Animated.loop(
          Animated.timing(spinValue, {
            toValue: 1,
            duration: 6000, // Adjust duration as needed
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ).start();
      } else {
        spinValue.setValue(0); // Stop rotation when not updating
      }
    }, []);

    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    return (
      <Btn
        type={vocab?.is_marked ? "active_green" : "simple"}
        onPress={() => {
          if (!IS_updatingMarked)
            UPDATE_vocabMarked(vocab?.id, !vocab?.is_marked);
        }} // Toggle spinning on press
        stayPressed={IS_updatingMarked}
        iconLeft={
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <ICON_bookmark_2 big active={vocab?.is_marked} />
          </Animated.View>
        }
      />
    );
  };

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
      UPDATE_vocabDifficulty={(diff: 1 | 2 | 3) => {
        if (ALLOW_action) {
          UPDATE_vocabDifficulty(vocab?.id, diff);
        }
      }}
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
      style={{ flex: 1 }}
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
  const Delete_BTN = () => (
    <Btn
      type="simple"
      onPress={() => {
        OPEN_vocabSoftDeleteModal(vocab);
      }}
      iconRight={<ICON_delete color="gray_light" />}
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
      <InlineBtn_WRAP>
        <Edit_BTN />
        <ToggleMarked_BTN />
        <ToggleDifficulties_BTN />
      </InlineBtn_WRAP>
    );

  if (list_TYPE === "private") {
    if (fetch_TYPE === "byTargetList") {
      return (
        <AllBtn_WRAP>
          <MyVocab3Btn_WRAP />
          <InlineBtn_WRAP>
            <Delete_BTN />
            <Close_BTN />
          </InlineBtn_WRAP>
        </AllBtn_WRAP>
      );
    }
    if (fetch_TYPE === "all" || fetch_TYPE === "marked") {
      return (
        <AllBtn_WRAP>
          <MyVocab3Btn_WRAP />
          <GoToList_BTN />
          <InlineBtn_WRAP>
            <Delete_BTN />
            <Close_BTN />
          </InlineBtn_WRAP>
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
