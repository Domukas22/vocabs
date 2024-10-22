//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import { User_MODEL } from "@/src/db/watermelon_MODELS";
import React, { useEffect, useMemo, useState } from "react";

import USE_fetchUsers from "../../../hooks/USE_fetchUsers";
import { USE_auth } from "@/src/context/Auth_CONTEXT";

interface UsersFlatlist_PROPS {
  search: string | undefined;
  selectedUser_IDS: string[] | undefined;
  SELECT_user: (id: string) => void;
  view: "all" | "selected";
}

export default function Users_FLATLIST({
  search = "",
  selectedUser_IDS = [],
  SELECT_user = () => {},
  view = "all",
}: UsersFlatlist_PROPS) {
  const { user } = USE_auth();

  const [users, SET_users] = useState<User_MODEL[]>([]);
  const { FETCH_users, ARE_usersFetching, users_ERROR } = USE_fetchUsers();

  const paginationSteps = useMemo(() => 10, []);

  const [pagination, SET_pagination] = useState({
    start: 0,
    end: paginationSteps,
  });

  // async function FETCH_moreUsers() {
  //   const response = await FETCH_users({
  //     myUser_ID: user?.id,
  //     search,
  //     start_INDEX: pagination.start + paginationSteps,
  //     end_INDEX: pagination.end - 1 + paginationSteps,
  //   });
  //   if (response.success && response?.data) {
  //     // Update users state with fetched data
  //     SET_users((prev) => [...prev, ...response.data]);
  //     SET_pagination((prev) => ({
  //       start: prev.start + paginationSteps,
  //       end: prev.end + paginationSteps,
  //     }));
  //   } else {
  //     console.error(response.msg);
  //   }
  // }

  useEffect(() => {
    (async () => {
      // Fetch users based on search term and pagination
      const response = await FETCH_users({
        myUser_ID: user?.id, // replace with the actual user ID
        search,
        start_INDEX: pagination.start,
        end_INDEX: pagination.end - 1, // Adjust end_INDEX to be inclusive
      });

      if (response.success && response.data) {
        // Update users state with fetched data
        SET_users(response?.data);
      } else {
        // Handle error (optional)
        console.error(response.msg);
      }
    })();
  }, [search]);

  return (
    <Styled_FLATLIST
      gap={8}
      data={
        view === "selected"
          ? users.filter((x) => selectedUser_IDS?.some((id) => id === x.id))
          : users
      }
      keyboardShouldPersistTaps="always"
      renderItem={({ item }) => {
        const IS_selected = selectedUser_IDS?.some((id) => id === item.id);

        return (
          <Btn
            key={"SelectUser" + item.id}
            text={item.username}
            iconRight={
              <ICON_X
                color={IS_selected ? "primary" : "grey"}
                rotate={IS_selected}
                big={true}
              />
            }
            onPress={() => SELECT_user(item.id)}
            type={IS_selected ? "active" : "simple"}
            style={{ flex: 1 }}
            text_STYLES={{ flex: 1 }}
          />
        );
      }}
      keyExtractor={(item) => "SelectUser" + item.id}
    />
  );
}
