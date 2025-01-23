import React, { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import Big_MODAL from "@/src/components/1_grouped/modals/Big_MODAL/Big_MODAL";
import SelectUsersModal_HEADER from "./SelectUsersModal_HEADER/SelectUsersModal_HEADER";

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import User_MODEL from "@/src/db/models/User_MODEL";
import Flashlist_LABEL from "@/src/components/1_grouped/texts/labels/Flashlist_LABEL";
import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import SearchAndSelect_SUBHEADER from "@/src/components/1_grouped/subheader/variations/SearchAndSelect_SUBHEADER/SearchAndSelect_SUBHEADER";
import {
  USE_fetchListAccessesSharedWithMe,
  USE_updateListAccesses,
} from "@/src/features/lists/functions";
import { USE_debounceSearch } from "@/src/hooks";
import { USE_zustand } from "@/src/hooks";
import USE_supabaseUsers from "../../../functions/fetch/hooks/USE_supabaseUsers/USE_supabaseUsers";
import { Users_FLATLIST } from "../../flatlists/Users_FLATLIST/Users_FLATLIST";
import SelectUsersModal_FOOTER from "./SelectUsersModal_FOOTER/SelectUsersModal_FOOTER";

interface SelectUsersModal_PROPS {
  open: boolean;
  list_id: string | undefined;
  TOGGLE_open: () => void;
  onUpdate: () => void;
}

export function SelectUsers_MODAL({
  open = false,
  list_id,
  TOGGLE_open,
  onUpdate = () => {},
}: SelectUsersModal_PROPS) {
  const { z_user } = USE_zustand();
  const [view, SET_view] = useState<"all" | "selected">("all");
  const {
    search: user_SEARCH,
    debouncedSearch: debouncedUser_SEARCH,
    SET_search: SET_userSearch,
    IS_debouncing: IS_debouncingUserSearch,
  } = USE_debounceSearch();
  const {
    search: selectedUser_SEARCH,
    debouncedSearch: debouncedSelectedUser_SEARCH,
    SET_search: SET_userSelectedSearch,
    IS_debouncing: IS_debouncingSelectedUserSearch,
  } = USE_debounceSearch();

  const [selectedUser_IDS, SET_selectedUserIds] = useState<Set<string>>(
    new Set()
  );

  const { FETCH_accesses, ARE_accessesFetching, accessesFetch_ERROR } =
    USE_fetchListAccessesSharedWithMe();

  const { UPDATE_listAccesses, ARE_accessesUpdating, accessesUpdate_ERROR } =
    USE_updateListAccesses();

  async function SELECT_usersByListAccess() {
    const accesses = await FETCH_accesses({
      user_id: z_user?.id || "",
      list_id: list_id || "",
    });
    if (accesses.success && accesses.data) {
      SET_selectedUserIds(new Set(accesses.data.map((x) => x.participant_id)));
    }
  }

  useEffect(() => {
    if (open) SELECT_usersByListAccess();
  }, [open]);

  const cancel = () => {
    TOGGLE_open();
    SET_userSearch("");
    SET_userSelectedSearch("");
    SET_selectedUserIds(new Set());
  };

  const submit = async () => {
    if (z_user?.id && list_id) {
      await UPDATE_listAccesses({
        owner_id: z_user.id,
        list_id,
        participant_ids: Array.from(selectedUser_IDS),
      });
    }
    SET_userSearch("");
    SET_userSelectedSearch("");
    TOGGLE_open();
    if (onUpdate) onUpdate();
  };

  const SELECT_user = (incomingUser_ID: string) => {
    SET_selectedUserIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(incomingUser_ID)) {
        newSet.delete(incomingUser_ID);
      } else {
        newSet.add(incomingUser_ID);
      }
      return newSet;
    });
  };

  const IS_inAction = useMemo(
    () => ARE_accessesFetching || ARE_accessesUpdating,
    [ARE_accessesFetching, ARE_accessesUpdating]
  );

  const {
    users,
    IS_fetching: ARE_usersFetching,
    error: fetchUsers_ERROR,
    LOAD_more: LOAD_moreUsers,
    IS_loadingMore: IS_loadingMoreUsers,
    total_COUNT: totalUser_COUNT,
  } = USE_supabaseUsers({
    search: debouncedUser_SEARCH,
    paginateBy: 2,
    view,
  });

  const {
    users: selected_USERS,
    IS_fetching: ARE_selectedusersFetching,
    error: fetchSelectedUsers_ERROR,
    LOAD_more: LOAD_moreSelectedUsers,
    IS_loadingMore: IS_loadingMoreSelectedUsers,
    total_COUNT: totalSelectedFilteredUser_COUNT,
  } = USE_supabaseUsers({
    search: debouncedSelectedUser_SEARCH,
    paginateBy: 2,
    onlySelected: true,
    selected_IDS: Array.from(selectedUser_IDS),
    view,
  });

  const [printed_USERS, SET_printedUsers] = useState<
    (User_MODEL & { selected: boolean })[] | undefined
  >([]);

  // const extendedUsers = useMemo(() => {
  //  SET_x(view === "all"
  //     ? users.map((u) => ({ ...u, selected: selectedUser_IDS.has(u.id) }))
  //     : selected_USERS
  //         .map((u) => ({
  //           ...u,
  //           selected: selectedUser_IDS.has(u.id),
  //         }))
  //         .filter((u) => u.selected));
  // }, [users, selected_USERS, view, selectedUser_IDS]);

  useEffect(() => {
    if (!ARE_usersFetching && view === "all") {
      SET_printedUsers(
        users?.map((u) => ({ ...u, selected: selectedUser_IDS.has(u.id) }))
      );
    }
    if (!ARE_selectedusersFetching && view === "selected") {
      SET_printedUsers(
        selected_USERS
          .map((u) => ({
            ...u,
            selected: selectedUser_IDS.has(u.id),
          }))
          .filter((u) => u.selected)
      );
    }

    // SET_printedUsers(
    //   view === "all"
    //     ? users.map((u) => ({ ...u, selected: selectedUser_IDS.has(u.id) }))
    //     : selected_USERS
    //         .map((u) => ({
    //           ...u,
    //           selected: selectedUser_IDS.has(u.id),
    //         }))
    //         .filter((u) => u.selected)
    // );
  }, [
    users,
    selected_USERS,
    view,
    selectedUser_IDS,
    ARE_usersFetching,
    ARE_selectedusersFetching,
    IS_debouncingUserSearch,
    IS_debouncingSelectedUserSearch,
    IS_loadingMoreUsers,
    IS_loadingMoreSelectedUsers,
  ]);

  return (
    <Big_MODAL {...{ open }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SelectUsersModal_HEADER {...{ IS_inAction, cancel }} />
        <SearchAndSelect_SUBHEADER
          {...{ view, SET_view }}
          search={view === "all" ? user_SEARCH : selectedUser_SEARCH}
          selected_COUNT={selectedUser_IDS.size}
          SET_search={view === "all" ? SET_userSearch : SET_userSelectedSearch}
        />
        <Users_FLATLIST
          users={printed_USERS}
          blurAndDisable={
            view === "all"
              ? IS_debouncingUserSearch
              : IS_debouncingSelectedUserSearch
          }
          {...{ selectedUser_IDS, SELECT_user }}
          listHeader_EL={
            <View style={{ marginBottom: 12 }}>
              <Flashlist_LABEL
                search={view === "all" ? user_SEARCH : selectedUser_SEARCH}
                IS_searching={
                  view === "all"
                    ? IS_debouncingUserSearch || ARE_usersFetching
                    : IS_debouncingSelectedUserSearch ||
                      ARE_selectedusersFetching
                }
                totalResult_COUNT={
                  view === "all"
                    ? totalUser_COUNT
                    : totalSelectedFilteredUser_COUNT
                }
                target={view === "all" ? "users" : "selected users"}
              />
            </View>
          }
          listFooter_EL={
            <BottomAction_BLOCK
              search={view === "all" ? user_SEARCH : selectedUser_SEARCH}
              LOAD_more={
                view === "all" ? LOAD_moreUsers : LOAD_moreSelectedUsers
              }
              IS_loadingMore={
                view === "all"
                  ? IS_loadingMoreUsers
                  : IS_loadingMoreSelectedUsers
              }
              activeFilter_COUNT={0}
              totalFilteredResults_COUNT={
                view === "all"
                  ? totalUser_COUNT
                  : totalSelectedFilteredUser_COUNT
              }
              HAS_reachedEnd={
                view === "all"
                  ? users?.length >= totalUser_COUNT
                  : selected_USERS?.length >= totalSelectedFilteredUser_COUNT
              }
              RESET_search={() =>
                view === "all" ? SET_userSearch("") : SET_userSelectedSearch("")
              }
            />
          }
        />

        <SelectUsersModal_FOOTER
          selected_COUNT={selectedUser_IDS.size}
          {...{ IS_inAction, cancel, submit }}
        />
      </KeyboardAvoidingView>
    </Big_MODAL>
  );
}
