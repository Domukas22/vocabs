//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { useRouter } from "expo-router";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { useEffect, useRef, useState } from "react";

import { List_MODEL } from "@/src/db/watermelon_MODELS";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";

import {
  CreateList_MODAL,
  List_SKELETONS,
  EmptyFlatList_BOTTM,
  MyLists_FLATLIST,
  MyLists_HEADER,
  MyLists_SUBNAV,
} from "@/src/features/1_lists";

import { useTranslation } from "react-i18next";
import { USE_searchedLists } from "@/src/features/1_lists/hooks/USE_searchedLists/USE_searchedLists";
import USE_highlighedId from "@/src/hooks/USE_highlighedId/USE_highlighedId";
import RenameList_MODAL from "@/src/features/1_lists/components/RenameList_MODAL/RenameList_MODAL";

import React from "react";
import { useToast } from "react-native-toast-notifications";
import DeleteList_MODAL from "@/src/features/1_lists/components/DeleteList_MODAL";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import { FlatList } from "react-native";
import db, { Languages_DB, Lists_DB, Users_DB } from "@/src/db";
import { Q } from "@nozbe/watermelondb";
import { USER_ID } from "@/src/constants/globalVars";
import Btn from "@/src/components/Btn/Btn";
import { sync } from "@/src/db/sync";
import { supabase } from "@/src/lib/supabase";

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

  const [search, SET_search] = useState("");

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
          lists: target_LIST,
        }}
      />

      {/* <Btn text="Sync" style={{ margin: 12 }} onPress={sync} />


      <Btn
        text="Increment"
        onPress={async () => {
          const id = "e64168f9-60c3-45a6-b4c9-a91f516d87fd";
          await supabase.rpc("increment_list_saved_count", {
            list_id: id,
          });
          await supabase.rpc("increment_list_saved_count", {
            list_id: "59c495d4-838d-44b1-b080-3dfead95928b",
          });

          await supabase.rpc("increment_list_saved_count", {
            list_id: "5c937b3a-ccbb-4ce8-83d3-dff134d71432",
          });
        }}
      /> */}
      <MyLists_FLATLIST
        user_id={user?.id}
        SELECT_list={(list: List_MODEL) => {
          SET_selectedList(list);
          router.push(`/(main)/vocabs/${list.id}`);
        }}
        SHOW_bottomBtn={search === ""}
        TOGGLE_createListModal={() => TOGGLE_modal("create")}
        highlighted_ID={highlighted_ID}
        _ref={list_REF}
        PREPARE_listRename={PREPARE_listRename}
        PREPADE_deleteList={PREPADE_deleteList}
      />

      <CreateList_MODAL
        user={user}
        IS_open={modal_STATES.create}
        currentList_NAMES={[]}
        CLOSE_modal={() => TOGGLE_modal("create")}
        onSuccess={(newList: List_MODEL) => {
          highlight(newList?.id);
          list_REF?.current?.scrollToOffset({ animated: true, offset: 0 });
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
        onSuccess={() => {
          SET_targetList(undefined);
          TOGGLE_modal("delete");
          toast.show(t("notifications.listDeleted"), {
            type: "green",
            duration: 5000,
          });
        }}
      />
    </Page_WRAP>
  );
}

///-----------------------------------------
