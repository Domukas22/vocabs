//
//
//

import { USE_createVocab } from "@/src/features/vocabs/functions";
import { useState } from "react";
import List_MODEL from "@/src/db/models/List_MODEL";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import TwoBtn_BLOCK from "@/src/components/1_grouped/blocks/TwoBtn_BLOCK/TwoBtn_BLOCK";
import { ICON_X } from "@/src/components/1_grouped/icons/icons";
import Big_MODAL from "@/src/components/1_grouped/modals/Big_MODAL/Big_MODAL";
import { CreateList_MODAL } from "@/src/features/lists/components";
import { t } from "i18next";
import {
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Header from "@/src/components/1_grouped/headers/regular/Header";
import { ChooseAList_FLATLIST } from "@/src/features/lists/components/flatlists/ChooseAList_FLATLIST/ChooseAList_FLATLIST";
import { USE_collectListLangs } from "@/src/features/lists/functions";
import { USE_zustand } from "@/src/hooks";
import { USE_modalToggles } from "@/src/hooks/index";

interface SavePublicVocabToListModal_PROPS {
  vocab: Vocab_MODEL | undefined;
  IS_open: boolean;
  TOGGLE_open: () => void;
  onSuccess: (new_VOCAB: Vocab_MODEL) => void;
}

export function SavePublicVocabToList_MODAL({
  vocab,
  IS_open,
  onSuccess,
  TOGGLE_open,
}: SavePublicVocabToListModal_PROPS) {
  const { modals } = USE_modalToggles(["createList"]);
  const { z_user } = USE_zustand();

  const { CREATE_vocab, IS_creatingVocab, db_ERROR, RESET_dbError } =
    USE_createVocab();

  const [selected_LIST, SET_selectedList] = useState<List_MODEL | undefined>(
    undefined
  );

  const {
    COLLECT_langs,
    IS_collectingLangs,
    collectLangs_ERROR,
    RESET_collectLangsError,
  } = USE_collectListLangs();

  const collectLangs = async (list_id: string) => {
    const updated_LIST = await COLLECT_langs({
      list_id,
    });
    if (!updated_LIST.success) {
      console.error(updated_LIST.msg); // Log internal message for debugging.
    }
  };

  const create = async () => {
    const result = await CREATE_vocab({
      user: z_user,
      list_id: selected_LIST?.id,
      difficulty: 3,
      description: vocab?.description,
      translations: vocab?.trs || [],
      onSuccess: (new_VOCAB: Vocab_MODEL) => {
        onSuccess(new_VOCAB);
        collectLangs(new_VOCAB?.list?.id || "");
      },
    });

    if (!result.success) {
      console.error(result.msg);
    }
  };

  return (
    <Big_MODAL open={IS_open}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Header
          title={"Save vocab to list"}
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

        <ChooseAList_FLATLIST
          {...{ selected_LIST }}
          SELECT_list={(list: List_MODEL) => SET_selectedList(list)}
          TOGGLE_createListModal={() => modals.createList.set(true)}
          user_id={z_user?.id || ""}
        />

        <TwoBtn_BLOCK
          btnLeft={
            <Btn text={t("btn.cancel")} onPress={TOGGLE_open} type="simple" />
          }
          btnRight={
            <Btn
              text={!IS_creatingVocab ? t("btn.confirmListSelection") : ""}
              iconRight={
                IS_creatingVocab ? <ActivityIndicator color="black" /> : null
              }
              onPress={() => {
                if (!IS_creatingVocab && selected_LIST) create();
              }}
              type="action"
              style={{ flex: 1, marginTop: "auto" }}
              stayPressed={IS_creatingVocab}
            />
          }
        />
      </KeyboardAvoidingView>
      <CreateList_MODAL
        user_id={z_user?.id}
        IS_open={modals.createList.IS_open}
        // currentList_NAMES={z_lists?.map((l) => l.name)}
        CLOSE_modal={() => modals.createList.set(false)}
        onSuccess={(newList: List_MODEL) => {
          SET_selectedList(newList);
        }}
      />
    </Big_MODAL>
  );
}
