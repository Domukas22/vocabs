//
//
//

import SearchBar from "@/src/components/SearchBar/SearchBar";
import Subnav from "@/src/components/Subnav/Subnav";
import React, { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import SelectUsersModal_HEADER from "./SelectUsersModal_HEADER/SelectUsersModal_HEADER";
import { ListAccess_MODEL, User_MODEL } from "@/src/db/watermelon_MODELS";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import USE_fetchListAccesses from "../../hooks/USE_fetchListAccesses";
import USE_fetchUsers from "../../hooks/USE_fetchUsers";
import Users_FLATLIST from "./Users_FLATLIST/Users_FLATLIST";
import SearchAndSelect_SUBNAV from "@/src/components/SearchAndSelect_SUBNAV/SearchAndSelect_SUBNAV";
import SelectUsersModal_FOOTER from "./SelectUsersModal_FOOTER/SelectUsersModal_FOOTER";
import USE_updateListAccesses from "../../hooks/USE_updateListAccesses";

interface SelectUsersModal_PROPS {
  open: boolean;
  list_id: string | undefined;
  TOGGLE_open: () => void;
}

export default function SelectUsers_MODAL({
  open = false,
  list_id,
  TOGGLE_open,
}: SelectUsersModal_PROPS) {
  const { user } = USE_auth();
  const [search, SET_search] = useState("");
  const [selectedUser_IDS, SET_selectedUserIds] = useState<string[]>([]);

  const { FETCH_accesses, ARE_accessesFetching, accessesFetch_ERROR } =
    USE_fetchListAccesses();

  const { UPDATE_listAccesses, ARE_accessesUpdating, accessesUpdate_ERROR } =
    USE_updateListAccesses();

  async function SELECT_usersByListAccess() {
    const accesses = await FETCH_accesses({
      user_id: user?.id,
      list_id: list_id || "",
    });
    if (accesses.success && accesses.data) {
      SET_selectedUserIds([...accesses.data].map((x) => x.participant_id));
    }
  }

  useEffect(() => {
    if (open) SELECT_usersByListAccess();
  }, [open]);

  const cancel = () => {
    TOGGLE_open();
    SET_search("");
  };

  const submit = async () => {
    if (user?.id && list_id) {
      UPDATE_listAccesses({
        owner_id: user.id,
        list_id,
        participant_ids: selectedUser_IDS || [],
      });
    }

    SET_search("");
    TOGGLE_open();
  };

  const SELECT_user = (incomingUSer_ID: string) => {
    if (selectedUser_IDS.some((id) => id === incomingUSer_ID)) {
      SET_selectedUserIds((prev) =>
        prev.filter((id) => id !== incomingUSer_ID)
      );
    } else {
      SET_selectedUserIds((prev) => [incomingUSer_ID, ...prev]);
    }
  };
  const [view, SET_view] = useState<"all" | "selected">("all");
  const IS_inAction = useMemo(
    () => ARE_accessesFetching || ARE_accessesUpdating,
    [ARE_accessesFetching]
  );

  return (
    <Big_MODAL {...{ open }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SelectUsersModal_HEADER {...{ IS_inAction, cancel }} />

        <SearchAndSelect_SUBNAV
          {...{ view, SET_view, search, SET_search }}
          selected_COUNT={selectedUser_IDS.length}
        />
        <Users_FLATLIST {...{ search, selectedUser_IDS, SELECT_user, view }} />

        <SelectUsersModal_FOOTER
          selected_COUNT={selectedUser_IDS.length}
          {...{ IS_inAction, cancel, submit }}
        />
      </KeyboardAvoidingView>
    </Big_MODAL>
  );
}
