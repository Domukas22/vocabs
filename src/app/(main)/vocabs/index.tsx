//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { useRouter } from "expo-router";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { useEffect, useRef, useState } from "react";

import { List_MODEL } from "@/src/db/models";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";

import {
  CreateList_MODAL,
  List_SKELETONS,
  EmptyFlatList_BOTTM,
  MyLists_FLATLIST,
  MyLists_HEADER,
  MyLists_SUBNAV,
  FETCH_myLists,
} from "@/src/features/1_lists";

import USE_zustand from "@/src/zustand";
import { useTranslation } from "react-i18next";
import { USE_searchedLists } from "@/src/features/1_lists/hooks/USE_searchedLists/USE_searchedLists";
import USE_highlighedId from "@/src/hooks/USE_highlighedId/USE_highlighedId";
import RenameList_MODAL from "@/src/features/1_lists/components/RenameList_MODAL/RenameList_MODAL";
import USE_renameList from "@/src/features/1_lists/hooks/USE_renameList";

import React from "react";
import Confirmation_MODAL from "@/src/components/Modals/Small_MODAL/Variations/Confirmation_MODAL/Confirmation_MODAL";
import USE_deleteList from "@/src/features/1_lists/hooks/USE_deleteList";
import { useToast } from "react-native-toast-notifications";
import UpdateList_MODAL from "@/src/features/1_lists/components/UpdateList_MODAL";

// TODO ==> create a DELETE_listModal, similar to DeleteVocab_MODAL

export default function MyLists_PAGE() {
  const router = useRouter();
  const [SHOW_createListModal, TOGGLE_createListModal, SET_createListModal] =
    USE_toggle(false);
  const { SET_selectedList } = USE_selectedList();
  const { user } = USE_auth();
  const [SHOW_renameListModal, TOGGLE_renameListModal] = USE_toggle();
  const [SHOW_deleteModal, TOGGLE_deleteModal] = USE_toggle();

  const { t } = useTranslation();
  const list_REF = useRef(null);
  const toast = useToast();

  const {
    z_lists,
    z_ARE_listsLoading,
    z_SET_lists,
    z_SET_listsLoading,
    z_SET_listsError,
    z_CREATE_privateList,
  } = USE_zustand();

  const { searched_LISTS, search, SEARCH_lists, ARE_listsSearching } =
    USE_searchedLists(z_lists);

  const { highlighted_ID, highlight } = USE_highlighedId();

  const { RENAME_list, IS_renamingList } = USE_renameList();
  const { DELETE_list, IS_deletingList } = USE_deleteList();
  // const highlighted_ID = "4a1cd271-cbf4-4134-a72f-78ba71a7cf03";

  const [target_LIST, SET_targetList] = useState<List_MODEL | undefined>(
    undefined
  );

  function PREPARE_listRename(list: List_MODEL) {
    SET_targetList(list);
    TOGGLE_renameListModal();
  }
  function PREPADE_deleteList(list: List_MODEL) {
    SET_targetList(list);
    TOGGLE_deleteModal();
  }

  useEffect(() => {
    (async () =>
      FETCH_myLists({
        user_id: user?.id,
        z: {
          z_SET_lists,
          z_SET_listsLoading,
          z_SET_listsError,
        },
      }))();
  }, []);

  useEffect(() => {
    if (searched_LISTS.length > 0) {
      SET_selectedList(searched_LISTS[0]);
      router.push("/(main)/vocabs/list");
    }
  }, [searched_LISTS.length]);

  return (
    <Page_WRAP>
      <MyLists_HEADER {...{ TOGGLE_createListModal, lists: z_lists }} />

      {z_lists.length > 5 && (
        <MyLists_SUBNAV {...{ search, SET_search: SEARCH_lists }} />
      )}
      {z_ARE_listsLoading || ARE_listsSearching ? <List_SKELETONS /> : null}
      {!z_ARE_listsLoading &&
      !ARE_listsSearching &&
      searched_LISTS.length > 0 ? (
        <MyLists_FLATLIST
          lists={searched_LISTS}
          SELECT_list={(list: List_MODEL) => {
            SET_selectedList(list);
            router.push("/(main)/vocabs/list");
          }}
          SHOW_bottomBtn={search === ""}
          TOGGLE_createListModal={TOGGLE_createListModal}
          highlighted_ID={highlighted_ID}
          _ref={list_REF}
          PREPARE_listRename={PREPARE_listRename}
          PREPADE_deleteList={PREPADE_deleteList}
        />
      ) : !z_ARE_listsLoading ? (
        <EmptyFlatList_BOTTM
          emptyBox_TEXT={
            search === ""
              ? t("label.youDontHaveAnyLists")
              : t("label.noListsFound")
          }
          btn_TEXT={t("btn.createList")}
          btn_ACTION={TOGGLE_createListModal}
        />
      ) : null}

      <CreateList_MODAL
        user={user}
        IS_open={SHOW_createListModal}
        currentList_NAMES={z_lists?.map((l) => l.name)}
        CLOSE_modal={() => SET_createListModal(false)}
        onSuccess={(newList: List_MODEL) => {
          highlight(newList?.id);
          list_REF?.current?.scrollToOffset({ animated: true, offset: 0 });
          z_CREATE_privateList(newList);
          toast.show(t("notifications.listCreated"), {
            type: "green",
            duration: 5000,
          });
          SET_createListModal(false);
        }}
      />
      <RenameList_MODAL
        open={SHOW_renameListModal}
        toggle={() => {
          SET_targetList(undefined);
          TOGGLE_renameListModal();
        }}
        title={t("modal.listSettings.renameListModalTitle")}
        rename={(new_NAME: string) => RENAME_list(target_LIST?.id, new_NAME)}
        IS_inAction={IS_renamingList}
        actionBtnText={t("btn.confirmListRename")}
        current_NAME={target_LIST?.name}
      />

      {/* ----- DELETE confirmation ----- */}
      <Confirmation_MODAL
        open={SHOW_deleteModal}
        toggle={() => {
          SET_targetList(undefined);
          TOGGLE_deleteModal();
        }}
        title={t("modal.listSettings.deleteListconfirmation")}
        action={() => DELETE_list(target_LIST?.id)}
        IS_inAction={IS_deletingList}
        actionBtnText={t("btn.confirmDelete")}
      />
    </Page_WRAP>
  );
}
