import React, { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import SelectUsersModal_HEADER from "./SelectUsersModal_HEADER/SelectUsersModal_HEADER";
import USE_fetchListAccesses from "../../hooks/USE_fetchListAccesses";
import Users_FLATLIST from "./Users_FLATLIST/Users_FLATLIST";
import SearchAndSelect_SUBNAV from "@/src/components/SearchAndSelect_SUBNAV/SearchAndSelect_SUBNAV";
import SelectUsersModal_FOOTER from "./SelectUsersModal_FOOTER/SelectUsersModal_FOOTER";
import USE_updateListAccesses from "../../hooks/USE_updateListAccesses";
import USE_zustand from "@/src/zustand";
import USE_supabaseUsers from "../../hooks/USE_supabaseUsers";
import BottomAction_SECTION from "@/src/components/BottomAction_SECTION";
import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";
import Btn from "@/src/components/Btn/Btn";

import Flashlist_LABEL from "@/src/components/Flashlist_LABEL";
import SelectOneUserModal_HEADER from "./SelectUsersModal_HEADER/SelectOneUserModal_HEADER";
import SearchOnly_SUBNAV from "@/src/components/SearchAndSelect_SUBNAV/SearchOnly_SUBNAV";
import USE_supabaseUsers_2, {
  FetchedUsers_PROPS,
} from "@/src/features/1_lists/hooks/USE_supabaseUsers_2";
import Users_FLATLIST_singleUser from "./Users_FLATLIST/Users_FLATLIST_singleUser";
import SelectOneUserModal_FOOTER from "./SelectUsersModal_FOOTER/SelectOneUserModal_FOOTER";

interface SelectUsersModal_PROPS {
  open: boolean;
  TOGGLE_open: () => void;
  submit: (user: FetchedUsers_PROPS) => void;
}

export default function SelectASingleUser_MODAL({
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
        <SearchOnly_SUBNAV search={search} SET_search={SET_search} />
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
            <BottomAction_SECTION
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
