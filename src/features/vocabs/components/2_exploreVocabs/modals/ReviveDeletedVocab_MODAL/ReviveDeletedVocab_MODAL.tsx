//
//
//

import { useState } from "react";
import List_MODEL from "@/src/db/models/List_MODEL";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import TwoBtn_BLOCK from "@/src/components/1_grouped/blocks/TwoBtn_BLOCK/TwoBtn_BLOCK";
import { ICON_X } from "@/src/components/1_grouped/icons/icons";
import Big_MODAL from "@/src/components/1_grouped/modals/Big_MODAL/Big_MODAL";
import { CreateList_MODAL } from "@/src/features/lists/components";
import { t } from "i18next";
import { KeyboardAvoidingView, Platform } from "react-native";
import Header from "@/src/components/1_grouped/headers/regular/Header";
import { ChooseAList_FLATLIST } from "@/src/features/lists/components/flatlists/ChooseAList_FLATLIST/ChooseAList_FLATLIST";
import { USE_collectListLangs } from "@/src/features/lists/functions";
import { USE_modalToggles } from "@/src/hooks/index";
import { z_USE_myVocabs } from "@/src/features_new/vocabs/hooks/zustand/z_USE_myVocabs/z_USE_myVocabs";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";

interface SavePublicVocabToListModal_PROPS {
  IS_open: boolean;
  CLOSE_modal: () => void;
}

export function ReviveDeletedVocab_MODAL({
  IS_open,

  CLOSE_modal,
}: SavePublicVocabToListModal_PROPS) {
  const { modals } = USE_modalToggles(["createList"]);
  const { z_target_VOCAB: vocab } = z_USE_myVocabs();

  const { z_user } = z_USE_user();

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

  return (
    <Big_MODAL open={IS_open}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Header
          title="Revive vocab"
          big={true}
          btnRight={
            <Btn
              type="seethrough"
              iconLeft={<ICON_X big={true} rotate={true} />}
              onPress={CLOSE_modal}
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
            <Btn text={t("btn.cancel")} onPress={CLOSE_modal} type="simple" />
          }
          btnRight={
            <Btn
              text={t("btn.confirmListSelection")}
              onPress={() => {
                if (selected_LIST?.id && vocab) {
                  // (async () => {
                  //   await vocab.REVIVE_vocab(selected_LIST.id);
                  //   if (onSuccess) onSuccess(vocab);
                  // })();
                }
              }}
              type="action"
              style={{ flex: 1, marginTop: "auto" }}
            />
          }
        />
      </KeyboardAvoidingView>
      <CreateList_MODAL
        user={z_user}
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
