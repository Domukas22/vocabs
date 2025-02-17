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

import {
  currentVocabAction_TYPE,
  Vocab_TYPE,
} from "@/src/features/vocabs/types";
import {
  vocabFetch_TYPES,
  vocabList_TYPES,
} from "@/src/features/vocabs/vocabList/USE_myVocabs/helpers/USE_fetchVocabs/helpers/FETCH_vocabs/types";
import { USE_toggle } from "@/src/hooks";
import { useTranslation } from "react-i18next";
import { View, ActivityIndicator } from "react-native";
import { useToast } from "react-native-toast-notifications";
import VocabBackDifficultyEdit_BTNS from "../VocabBackDifficultyEdit_BTNS/VocabBackDifficultyEdit_BTNS";
import React, { useMemo, memo } from "react";
import { MyColors } from "@/src/constants/MyColors";
import { useRouter } from "expo-router";

interface VocabBackBtns_PROPS {
  vocab: Vocab_TYPE;
  list_TYPE: vocabList_TYPES;
  fetch_TYPE: vocabFetch_TYPES;
  OPEN_updateVocabModal: (vocab?: Vocab_TYPE) => void;
  OPEN_vocabCopyModal: () => void;
  OPEN_vocabPermaDeleteModal: (vocab: Vocab_TYPE) => void;

  TOGGLE_open: () => void;
  GO_toListOfVocab: () => void;
  UPDATE_vocabDifficulty: (
    vocab_ID: string,
    current_DIFFICULTY: number,
    new_DIFFICULTY: 1 | 2 | 3,
    CLOSE_editBtns: () => void
  ) => Promise<void>;
  UPDATE_vocabMarked: (vocab_ID: string, val: boolean) => Promise<void>;
  SOFTDELETE_vocab: (vocab_ID: string) => Promise<void>;
  HARDDELETE_vocab: (vocab_ID: string) => Promise<void>;
  current_ACTIONS: currentVocabAction_TYPE[];
  test: (num: number) => void;
}

const VocabBack_BTNS = React.memo(function VocabBack_BTNS({
  vocab,
  list_TYPE,
  fetch_TYPE,
  current_ACTIONS = [],
  OPEN_updateVocabModal = () => {},
  OPEN_vocabCopyModal = () => {},

  OPEN_vocabPermaDeleteModal = () => {},

  TOGGLE_open = () => {},
  test = () => {},
  GO_toListOfVocab = () => {},
  UPDATE_vocabDifficulty = () => Promise.resolve(),
  UPDATE_vocabMarked = () => Promise.resolve(),
  SOFTDELETE_vocab = () => Promise.resolve(),
  HARDDELETE_vocab = () => Promise.resolve(),
}: VocabBackBtns_PROPS) {
  const { t } = useTranslation();
  const router = useRouter();

  const [SHOW_difficultyEdits, TOGGLE_difficultyEdits, SET_difficultyEdit] =
    USE_toggle(false);

  const [
    SHOW_deleteConfirmation,
    TOGGLE_deleteConfirmation,
    SET_deleteConfirmation,
  ] = USE_toggle(false);

  const IS_updatingMarked = useMemo(() => {
    return current_ACTIONS?.some(
      (action) => action.action === "updating_marked"
    );
  }, [current_ACTIONS]);

  const IS_deleting = useMemo(() => {
    return current_ACTIONS?.some((action) => action.action === "deleting");
  }, [current_ACTIONS]);

  const IS_updatingDifficulty = useMemo(() => {
    const target = current_ACTIONS?.find(
      (action) => action.action === "updating_difficulty"
    );

    const infos = {
      IS_updating: !!target,
      target_DIFFICULTY: target?.new_DIFFICULTY,
    };

    return infos;
  }, [current_ACTIONS]);

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
      onPress={() => OPEN_updateVocabModal(vocab)}
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
          await UPDATE_vocabMarked(vocab?.id, !vocab?.is_marked);
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
        IS_updatingDifficulty?.IS_updating ? (
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
      UPDATE_vocabDifficulty={(diff: 1 | 2 | 3) =>
        UPDATE_vocabDifficulty(vocab?.id, vocab?.difficulty, diff, () =>
          SET_difficultyEdit(false)
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
            onPress={() =>
              deleteType === "hard"
                ? HARDDELETE_vocab(vocab?.id)
                : SOFTDELETE_vocab(vocab?.id)
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
