//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_checkMark } from "@/src/components/icons/icons";
import Styled_FLASHLIST from "@/src/components/Styled_FLATLIST/Styled_FLASHLIST/Styled_FLASHLIST";
import { FetchedUsers_PROPS } from "@/src/features/1_lists/hooks/USE_supabaseUsers_2";
import React from "react";

interface UsersFlatlist_PROPS {
  users: FetchedUsers_PROPS[] | undefined;
  listHeader_EL: React.ReactNode | undefined;
  listFooter_EL: React.ReactNode | undefined;
  selected_USER: FetchedUsers_PROPS | undefined;
  SELECT_user: (user: FetchedUsers_PROPS) => void;
  blurAndDisable: boolean;
}

export default function Users_FLATLIST_singleUser({
  users = [],
  listHeader_EL,
  listFooter_EL,
  selected_USER,
  SELECT_user = () => {},
  blurAndDisable = false,
}: UsersFlatlist_PROPS) {
  return (
    <Styled_FLASHLIST
      gap={8}
      data={users}
      extraData={selected_USER}
      renderItem={({ item }) => (
        <Btn
          blurAndDisable={blurAndDisable}
          key={"SelectUser" + item.id}
          text={item.username}
          iconRight={
            selected_USER?.id === item.id ? (
              <ICON_checkMark color="primary" />
            ) : null
          }
          onPress={() => SELECT_user(item)}
          type={selected_USER?.id === item.id ? "active" : "simple"}
          style={{ flex: 1 }}
          text_STYLES={{ flex: 1 }}
        />
      )}
      keyExtractor={(item) => "SelectUser" + item.id}
      ListHeaderComponent={listHeader_EL}
      ListFooterComponent={listFooter_EL}
    />
  );
}
