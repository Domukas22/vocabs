//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { useRouter } from "expo-router";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { useEffect, useMemo, useState } from "react";

import { List_MODEL } from "@/src/db/models";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";

import {
  CreateList_MODAL,
  List_SKELETONS,
  MyLists_BOTTOM,
  MyLists_FLATLIST,
  MyLists_HEADER,
  MyLists_SUBNAV,
  FETCH_myLists,
} from "@/src/features/1_lists";

import { Button } from "react-native";
import FILTER_lists from "@/src/features/1_lists/utils/FILTER_lists";

import USE_zustand from "@/src/zustand";

export default function MyLists_PAGE() {
  const router = useRouter();
  const [SHOW_createListModal, TOGGLE_createListModal] = USE_toggle(false);
  const { SET_selectedList } = USE_selectedList();
  const { user } = USE_auth();
  const [search, SET_search] = useState("");

  const {
    z_lists,
    z_ARE_listsLoading,
    z_SET_lists,
    z_SET_listsLoading,
    z_SET_listsError,
  } = USE_zustand();

  const filtered_LISTS = useMemo(
    () => FILTER_lists({ search, lists: z_lists }),
    [search, z_lists]
  );

  useEffect(() => {
    console.log("FIRE HERE");

    (async () =>
      FETCH_myLists({
        user_id: user.id,
        z: {
          z_SET_lists,
          z_SET_listsLoading,
          z_SET_listsError,
        },
      }))();
  }, []);

  return (
    <Page_WRAP>
      <MyLists_HEADER {...{ TOGGLE_createListModal }} />

      {z_lists.length > 5 && <MyLists_SUBNAV {...{ search, SET_search }} />}
      {z_ARE_listsLoading ? <List_SKELETONS /> : null}
      {!z_ARE_listsLoading && filtered_LISTS.length > 0 ? (
        <MyLists_FLATLIST
          lists={filtered_LISTS}
          SELECT_list={(list: List_MODEL) => {
            SET_selectedList(list);
            router.push("/(main)/vocabs/list");
          }}
          SHOW_bottomBtn={search === ""}
          TOGGLE_createListModal={TOGGLE_createListModal}
        />
      ) : !z_ARE_listsLoading ? (
        <MyLists_BOTTOM {...{ search, TOGGLE_createListModal }} />
      ) : null}

      <CreateList_MODAL
        open={SHOW_createListModal}
        toggle={TOGGLE_createListModal}
      />
    </Page_WRAP>
  );
}
