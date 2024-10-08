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
import DeleteList_MODAL from "@/src/features/1_lists/components/DeleteList_MODAL";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import { FlatListComponent, ViewComponent } from "react-native";
import { FlatList } from "react-native";

export default function MyLists_PAGE() {
  const { user } = USE_auth();
  const { t } = useTranslation();
  const { SET_selectedList } = USE_selectedList();

  const router = useRouter();
  const list_REF = useRef<FlatList<any>>(null);
  const toast = useToast();

  const { highlighted_ID, highlight } = USE_highlighedId();
  const [target_LIST, SET_targetList] = useState<List_MODEL | undefined>(
    undefined
  );
  const {
    z_lists,
    z_CREATE_privateList,
    z_RENAME_privateList,
    z_DELETE_privateList,
  } = USE_zustand();
  const { searched_LISTS, search, SEARCH_lists, ARE_listsSearching } =
    USE_searchedLists(z_lists);

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "create", initialValue: false },
    { name: "rename", initialValue: false },
    { name: "delete", initialValue: false },
  ]);

  function PREPARE_listRename(list: List_MODEL) {
    SET_targetList(list);
    TOGGLE_modal("rename");
  }
  function PREPADE_deleteList(list: List_MODEL) {
    SET_targetList(list);
    TOGGLE_modal("delete");
  }

  return (
    <Page_WRAP>
      <MyLists_HEADER
        {...{
          TOGGLE_createListModal: () => TOGGLE_modal("create"),
          lists: z_lists,
        }}
      />

      {z_lists.length > 5 && (
        <MyLists_SUBNAV {...{ search, SET_search: SEARCH_lists }} />
      )}

      {!ARE_listsSearching && searched_LISTS.length > 0 ? (
        <MyLists_FLATLIST
          lists={searched_LISTS}
          SELECT_list={(list: List_MODEL) => {
            SET_selectedList(list);
            router.push("/(main)/vocabs/list");
          }}
          SHOW_bottomBtn={search === ""}
          TOGGLE_createListModal={() => TOGGLE_modal("create")}
          highlighted_ID={highlighted_ID}
          _ref={list_REF}
          PREPARE_listRename={PREPARE_listRename}
          PREPADE_deleteList={PREPADE_deleteList}
        />
      ) : !ARE_listsSearching ? (
        <EmptyFlatList_BOTTM
          emptyBox_TEXT={
            search === ""
              ? t("label.youDontHaveAnyLists")
              : t("label.noListsFound")
          }
          btn_TEXT={t("btn.createList")}
          btn_ACTION={() => TOGGLE_modal("create")}
        />
      ) : ARE_listsSearching ? (
        <List_SKELETONS />
      ) : null}

      <CreateList_MODAL
        user_id={user?.id}
        IS_open={modal_STATES.create}
        currentList_NAMES={z_lists?.map((l) => l.name)}
        CLOSE_modal={() => TOGGLE_modal("create")}
        onSuccess={(newList: List_MODEL) => {
          highlight(newList?.id);
          list_REF?.current?.scrollToOffset({ animated: true, offset: 0 });
          z_CREATE_privateList(newList);
          toast.show(t("notifications.listCreated"), {
            type: "green",
            duration: 5000,
          });
        }}
      />
      <RenameList_MODAL
        list_id={target_LIST?.id}
        user_id={user?.id}
        current_NAME={target_LIST?.name}
        IS_open={modal_STATES.rename}
        CLOSE_modal={() => TOGGLE_modal("rename")}
        onSuccess={(updated_LIST?: List_MODEL) => {
          if (updated_LIST) {
            z_RENAME_privateList(updated_LIST);
            highlight(updated_LIST.id);
            toast.show(t("notifications.listRenamed"), {
              type: "green",
              duration: 5000,
            });
          }
        }}
      />

      <DeleteList_MODAL
        user_id={user?.id}
        IS_open={modal_STATES.delete}
        list_id={target_LIST?.id}
        CLOSE_modal={() => TOGGLE_modal("delete")}
        onSuccess={(deleted_LIST?: List_MODEL) => {
          if (!deleted_LIST) return;
          SET_targetList(undefined);
          z_DELETE_privateList(deleted_LIST?.id);
          toast.show(
            t("notifications.listDeletedPre") +
              `"${deleted_LIST?.name}"` +
              t("notifications.listDeletedPost"),
            {
              type: "green",
              duration: 5000,
            }
          );
        }}
      />
    </Page_WRAP>
  );
}
