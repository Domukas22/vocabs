//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import Styled_FLASHLIST from "@/src/components/Styled_FLATLIST/Styled_FLASHLIST/Styled_FLASHLIST";
import { User_MODEL } from "@/src/db/watermelon_MODELS";
import React from "react";

interface UsersFlatlist_PROPS {
  users: (User_MODEL & { selected: boolean })[] | undefined;
  listHeader_EL: React.ReactNode | undefined;
  listFooter_EL: React.ReactNode | undefined;
  selectedUser_IDS: Set<string>;
  SELECT_user: (user_id: string) => void;
  blurAndDisable: boolean;
}

export default function Users_FLATLIST({
  users = [],
  listHeader_EL,
  listFooter_EL,
  selectedUser_IDS = new Set(),
  SELECT_user = () => {},
  blurAndDisable = false,
}: UsersFlatlist_PROPS) {
  return (
    <Styled_FLASHLIST
      gap={8}
      data={users}
      renderItem={({ item }) => (
        <Btn
          blurAndDisable={blurAndDisable}
          key={"SelectUser" + item.id}
          text={item.username}
          iconRight={
            <ICON_X
              color={item.selected ? "primary" : "grey"}
              rotate={item.selected}
              big={true}
            />
          }
          onPress={() => {
            SELECT_user(item.id);
          }}
          type={item.selected ? "active" : "simple"}
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
