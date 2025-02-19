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
  ICON_X,
} from "@/src/components/1_grouped/icons/icons";

import { myVocabFetch_TYPES } from "@/src/features_new/vocabs/hooks/USE_fetchVocabs/FETCH_vocabs/types";
import { USE_toggle, USE_zustand } from "@/src/hooks";
import { useTranslation } from "react-i18next";
import { View, ActivityIndicator } from "react-native";
import VocabBackDifficultyEdit_BTNS from "../VocabBackDifficultyEdit_BTNS/VocabBackDifficultyEdit_BTNS";
import React, { useMemo, memo } from "react";
import { MyColors } from "@/src/constants/MyColors";
import { useRouter } from "expo-router";
import { z_USE_myOneList } from "@/src/features_new/lists/hooks/z_USE_myOneList/z_USE_myOneList";
import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { list_TYPES } from "@/src/features_new/lists/types";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { USE_markVocab } from "@/src/features_new/vocabs/hooks/actions/USE_markVocab/USE_markVocab";
import { USE_updateVocabDifficulty } from "@/src/features_new/vocabs/hooks/actions/USE_updateVocabDifficulty/USE_updateVocabDifficulty";
import { USE_softDeletevocab } from "@/src/features_new/vocabs/hooks/actions/USE_softDeletevocab/USE_softDeletevocab";
import { USE_hardDeleteVocab } from "@/src/features_new/vocabs/hooks/actions/USE_hardDeleteVocab/USE_hardDeleteVocab";

interface VocabBackBtns_PROPS {
  vocab: Vocab_TYPE;
  list_TYPE: list_TYPES;
  fetch_TYPE: myVocabFetch_TYPES;
  OPEN_updateVocabModal: () => void;
  OPEN_vocabCopyModal: () => void;

  TOGGLE_open: () => void;
  GO_toListOfVocab: () => void;
}

const VocabBack_BTNS = React.memo(function VocabBack_BTNS({
  vocab,
  list_TYPE,
  fetch_TYPE,

  OPEN_updateVocabModal = () => {},
  OPEN_vocabCopyModal = () => {},

  TOGGLE_open = () => {},

  GO_toListOfVocab = () => {},
}: VocabBackBtns_PROPS) {
  const { t } = useTranslation();
  const router = useRouter();
  const { z_user } = USE_zustand();

  const { z_currentActions, IS_inAction } = z_USE_currentActions();

  const [SHOW_difficultyEdits, TOGGLE_difficultyEdits, SET_difficultyEdit] =
    USE_toggle(false);

  const { z_FETCH_myOneListById } = z_USE_myOneList();

  const { MARK_vocab } = USE_markVocab();
  const { UPDATE_vocabDifficulty } = USE_updateVocabDifficulty();
  const { SOFTDELETE_vocab } = USE_softDeletevocab();
  const { HARDDELETE_vocab } = USE_hardDeleteVocab();

  const [
    SHOW_deleteConfirmation,
    TOGGLE_deleteConfirmation,
    SET_deleteConfirmation,
  ] = USE_toggle(false);

  const IS_updatingMarked = useMemo(
    () => IS_inAction("vocab", vocab?.id, "updating_marked"),
    [z_currentActions]
  );

  const IS_deleting = useMemo(
    () => IS_inAction("vocab", vocab?.id, "deleting"),
    [z_currentActions]
  );

  const IS_updatingDifficulty = useMemo(
    () => IS_inAction("vocab", vocab?.id, "updating_difficulty"),
    [z_currentActions]
  );

  const AllBtn_WRAP = memo(({ children }: { children: React.ReactNode }) => (
    <View style={{ padding: 12, gap: 8 }}>{children}</View>
  ));

  const InlineBtn_WRAP = memo(({ children }: { children: React.ReactNode }) => (
    <View style={{ flexDirection: "row", gap: 8 }}>{children}</View>
  ));

  const Edit_BTN = memo(() => (
    <Btn
      type="simple"
      style={{ flex: 1 }}
      onPress={() => OPEN_updateVocabModal()}
      text={t("btn.editVocab")}
      iconRight={<ICON_edit />}
      text_STYLES={{ marginRight: "auto" }}
    />
  ));

  const ToggleMarked_BTN = memo(() => {
    return (
      <Btn
        type={vocab?.is_marked ? "active_green" : "simple"}
        onPress={async () => {
          await MARK_vocab(vocab?.id, vocab?.list_id, !vocab?.is_marked);
        }} // Toggle spinning on press
        stayPressed={IS_updatingMarked}
        iconLeft={
          <View style={{ width: 26, alignItems: "center" }}>
            {IS_updatingMarked ? (
              <ActivityIndicator
                color={
                  vocab?.is_marked ? MyColors.icon_green : MyColors.icon_gray
                }
              />
            ) : (
              <ICON_bookmark_2 big active={vocab?.is_marked} />
            )}
          </View>
        }
      />
    );
  });

  const ToggleDifficulties_BTN = memo(() => (
    <Btn
      type="simple"
      onPress={TOGGLE_difficultyEdits}
      iconLeft={
        IS_updatingDifficulty ? (
          <ActivityIndicator color={MyColors.icon_gray} />
        ) : (
          <ICON_difficultyDot difficulty={vocab?.difficulty || 0} big={true} />
        )
      }
    />
  ));

  const VocabDifficulty_BTNS = memo(() => (
    <VocabBackDifficultyEdit_BTNS
      active_DIFFICULTY={vocab?.difficulty || 0}
      UPDATE_vocabDifficulty={async (new_DIFFICULY: 1 | 2 | 3) =>
        await UPDATE_vocabDifficulty(
          vocab?.id,
          vocab?.difficulty,
          new_DIFFICULY
        )
      }
      TOGGLE_open={TOGGLE_difficultyEdits}
      IS_updatingDifficulty={IS_updatingDifficulty}
    />
  ));

  const Close_BTN = memo(() => (
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
  ));

  const GoToList_BTN = memo(() => (
    <Btn
      type="simple"
      onPress={() => {
        if (vocab?.list_id) {
          z_FETCH_myOneListById(vocab?.list_id, z_user?.id || "", {});
          router.replace(`/(main)/vocabs/${vocab?.list_id}`);
        }
      }}
      text={t("btn.goToListOfVocab")}
      iconRight={<ICON_arrow direction="right" />}
      text_STYLES={{ marginRight: "auto" }}
    />
  ));

  const Restore_BTN = memo(() => (
    <Btn
      type="simple"
      onPress={() => {}}
      text={t("btn.restoreVocab")}
      iconRight={<ICON_restore />}
      text_STYLES={{ marginRight: "auto", color: MyColors.text_green }}
    />
  ));

  const DeleteForever_BTN = memo(() => (
    <Btn
      type="simple"
      onPress={GO_toListOfVocab}
      text={t("btn.deletePermanently")}
      iconRight={<ICON_delete />}
      text_STYLES={{ marginRight: "auto", color: MyColors.text_red }}
    />
  ));

  const DeleteIcon_BTN = memo(() => (
    <Btn
      type="simple"
      onPress={() => {
        SET_deleteConfirmation(true);
      }}
      iconRight={<ICON_delete color="gray_light" />}
    />
  ));
  const X_BTN = memo(({ onPress = () => {} }: { onPress: () => void }) => (
    <Btn
      type="simple"
      onPress={onPress}
      iconLeft={<ICON_X big rotate />}
      style={{
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderRightWidth: 0,
      }}
    />
  ));
  const Delete_BTN = memo(
    ({
      text = "Btn",
      onPress = () => {},
    }: {
      text: string;
      onPress: () => void;
    }) => (
      <Btn
        type="delete"
        onPress={onPress}
        text={IS_deleting ? "" : text}
        text_STYLES={{ marginRight: "auto" }}
        stayPressed={IS_deleting}
        style={[
          { flex: 1 },
          !IS_deleting && { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
        ]}
        iconRight={
          IS_deleting ? (
            <ActivityIndicator color={MyColors.icon_red} />
          ) : (
            <ICON_delete />
          )
        }
      />
    )
  );

  const Copy_BTN = memo(() => (
    <Btn
      type="simple"
      onPress={OPEN_vocabCopyModal}
      text={t("btn.saveVocab")}
      iconRight={<ICON_X color="green" big />}
      text_STYLES={{ marginRight: "auto", color: MyColors.text_green }}
    />
  ));

  const MyVocab3Btn_WRAP = memo(() =>
    SHOW_difficultyEdits ? (
      <VocabDifficulty_BTNS />
    ) : (
      <InlineBtn_WRAP>
        <Edit_BTN />
        <ToggleMarked_BTN />
        <ToggleDifficulties_BTN />
      </InlineBtn_WRAP>
    )
  );

  const CloseBtn_WRAP = memo(
    ({ deleteType = "soft" }: { deleteType: "hard" | "soft" }) =>
      SHOW_deleteConfirmation ? (
        <View style={{ flexDirection: "row" }}>
          {!IS_deleting ? (
            <X_BTN onPress={() => SET_deleteConfirmation(false)} />
          ) : null}
          <Delete_BTN
            text={
              deleteType === "soft"
                ? t("btn.deleteVocab")
                : t("btn.deleteVocabHard")
            }
            onPress={async () =>
              deleteType === "hard"
                ? await HARDDELETE_vocab(vocab?.id)
                : await SOFTDELETE_vocab(vocab?.id, vocab?.list_id)
            }
          />
        </View>
      ) : (
        <InlineBtn_WRAP>
          <DeleteIcon_BTN />
          <Close_BTN />
        </InlineBtn_WRAP>
      )
  );

  if (list_TYPE === "private") {
    if (fetch_TYPE === "byTargetList") {
      return (
        <AllBtn_WRAP>
          <MyVocab3Btn_WRAP />
          <CloseBtn_WRAP deleteType="soft" />
        </AllBtn_WRAP>
      );
    }
    if (fetch_TYPE === "all" || fetch_TYPE === "marked") {
      return (
        <AllBtn_WRAP>
          <MyVocab3Btn_WRAP />
          <GoToList_BTN />
          <CloseBtn_WRAP deleteType="soft" />
        </AllBtn_WRAP>
      );
    }
    if (fetch_TYPE === "deleted") {
      return (
        <AllBtn_WRAP>
          <Restore_BTN />
          <CloseBtn_WRAP deleteType="hard" />
        </AllBtn_WRAP>
      );
    }
  }

  return (
    <AllBtn_WRAP>
      <Copy_BTN />
      <GoToList_BTN />
      <Close_BTN />
    </AllBtn_WRAP>
  );
});

export default VocabBack_BTNS;
