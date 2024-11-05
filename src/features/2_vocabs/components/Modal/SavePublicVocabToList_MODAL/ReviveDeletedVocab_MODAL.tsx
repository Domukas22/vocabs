//
//
//

import SelectMyList_MODAL, {
  MyLists_FLATLIST,
} from "@/src/features/1_lists/components/SelectMyList_MODAL/SelectMyList_MODAL";
import USE_createVocab from "../../../hooks/USE_createVocab";
import { useState } from "react";
import { tr_PROPS } from "@/src/db/props";

import { CreateMyVocabData_PROPS } from "../CreateVocab_MODAL/CreateVocab_MODAL";
import { List_MODEL, Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import Btn from "@/src/components/Btn/Btn";
import Footer from "@/src/components/Footer/Footer";
import { ICON_X } from "@/src/components/icons/icons";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import Subnav from "@/src/components/Subnav/Subnav";
import { CreateList_MODAL } from "@/src/features/1_lists";
import SEARCH_lists from "@/src/features/1_lists/utils/SEARCH_lists";
import { t } from "i18next";
import {
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SearchBar } from "react-native-screens";
import Header from "@/src/components/Header/Header";
import { ChooseAList_FLATLIST } from "@/src/features/1_lists/components/ChooseAList_FLATLIST/ChooseAList_FLATLIST";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import USE_collectListLangs from "@/src/features/1_lists/hooks/USE_collectListLangs";
import USE_incrementListSavedCount from "@/src/features/1_lists/hooks/USE_incrementListSavedCount";
import USE_zustand from "@/src/zustand";

interface SavePublicVocabToListModal_PROPS {
  vocab: Vocab_MODEL | undefined;
  IS_open: boolean;
  TOGGLE_open: () => void;
  onSuccess: (new_VOCAB: Vocab_MODEL) => void;
}

export default function ReviveDeletedVocab_MODAL({
  vocab,
  IS_open,
  onSuccess,
  TOGGLE_open,
}: SavePublicVocabToListModal_PROPS) {
  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "create", initialValue: false },
  ]);

  const { z_user } = USE_zustand();

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
          TOGGLE_createListModal={() => TOGGLE_modal("create")}
          user_id={z_user?.id || ""}
        />

        <Footer
          btnLeft={
            <Btn text={t("btn.cancel")} onPress={TOGGLE_open} type="simple" />
          }
          btnRight={
            <Btn
              text={t("btn.confirmListSelection")}
              onPress={() => {
                if (selected_LIST?.id && vocab) {
                  (async () => {
                    await vocab.REVIVE_vocab(selected_LIST.id);
                  })();
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
        IS_open={modal_STATES.create}
        // currentList_NAMES={z_lists?.map((l) => l.name)}
        CLOSE_modal={() => TOGGLE_modal("create")}
        onSuccess={(newList: List_MODEL) => {
          SET_selectedList(newList);
        }}
      />
    </Big_MODAL>
  );
}