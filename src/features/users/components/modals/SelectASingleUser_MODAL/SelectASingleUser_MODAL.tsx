import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import Big_MODAL from "@/src/components/1_grouped/modals/Big_MODAL/Big_MODAL";
import { USE_zustand } from "@/src/hooks";
import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import { USE_debounceSearch } from "@/src/hooks";

import Flashlist_LABEL from "@/src/components/1_grouped/texts/labels/Flashlist_LABEL";
import SelectOneUserModal_HEADER from "../SelectUsers_MODAL/SelectUsersModal_HEADER/SelectOneUserModal_HEADER";
import SearchOnly_SUBHEADER from "@/src/components/1_grouped/subheader/variations/SearchOnly_SUBHEADER/SearchOnly_SUBHEADER";
import USE_supabaseUsers_2, {
  FetchedUsers_PROPS,
} from "@/src/features/users/functions/fetch/hooks/USE_supabaseUsers/USE_supabaseUsers_2";
import { Users_FLATLIST_singleUser } from "../../flatlists/Users_FLATLIST/Users_FLATLIST_singleUser";
import SelectOneUserModal_FOOTER from "../SelectUsers_MODAL/SelectUsersModal_FOOTER/SelectOneUserModal_FOOTER";

interface SelectUsersModal_PROPS {
  open: boolean;
  TOGGLE_open: () => void;
  submit: (user: FetchedUsers_PROPS) => void;
}

export function SelectASingleUser_MODAL({
  open = false,
  TOGGLE_open,
  submit = async () => {},
}: SelectUsersModal_PROPS) {
  const { z_user } = USE_zustand();
  const [view, SET_view] = useState<"all" | "selected">("all");
  const { search, debouncedSearch, SET_search, IS_debouncing } =
    USE_debounceSearch();

  const [selected_USER, SET_selectedUser] = useState<
    FetchedUsers_PROPS | undefined
  >();

  const cancel = () => {
    TOGGLE_open();
    SET_search("");
    SET_selectedUser(undefined);
  };

  const {
    data: users,
    error: fetchUsers_ERROR,
    IS_searching,
    HAS_reachedEnd,
    IS_loadingMore,
    unpaginated_COUNT,
    LOAD_more,
  } = USE_supabaseUsers_2({
    search: debouncedSearch,
    IS_debouncing,
  });

  return (
    <Big_MODAL {...{ open }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SelectOneUserModal_HEADER {...{ cancel }} />
        <SearchOnly_SUBHEADER search={search} SET_search={SET_search} />
        <Users_FLATLIST_singleUser
          {...{ users, selected_USER }}
          blurAndDisable={IS_debouncing}
          SELECT_user={(user) => SET_selectedUser(user)}
          listHeader_EL={
            <View style={{ marginBottom: 12 }}>
              <Flashlist_LABEL
                {...{ search, IS_searching }}
                HAS_error={fetchUsers_ERROR.value}
                totalResult_COUNT={unpaginated_COUNT}
                target={view === "all" ? "users" : "selected users"}
              />
            </View>
          }
          listFooter_EL={
            <BottomAction_BLOCK
              type="users"
              {...{
                search,
                IS_loadingMore,
                LOAD_more,
                IS_debouncing,
                HAS_reachedEnd,
              }}
              activeFilter_COUNT={0}
              totalFilteredResults_COUNT={unpaginated_COUNT}
              RESET_search={() => SET_search("")}
            />
          }
        />

        <SelectOneUserModal_FOOTER
          submit={(user: FetchedUsers_PROPS) => {
            SET_selectedUser(undefined);
            submit(user);
          }}
          {...{ selected_USER, cancel }}
        />
      </KeyboardAvoidingView>
    </Big_MODAL>
  );
}
