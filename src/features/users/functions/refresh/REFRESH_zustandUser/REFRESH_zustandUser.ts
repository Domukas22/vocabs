//
//
//

import { Users_DB } from "@/src/db";
import { z_setUser_PROPS } from "@/src/hooks/USE_zustand/USE_zustand";
import { Q } from "@nozbe/watermelondb";

export async function REFRESH_zustandUser({
  user_id,
  z_SET_user,
}: {
  user_id: string | undefined;
  z_SET_user: z_setUser_PROPS;
}) {
  if (!user_id)
    return console.error(
      " 🔴User id not defined when refreshing zustand user 🔴"
    );
  if (!z_SET_user)
    return console.error(
      " 🔴 z_SET_user not defined when refreshing zustand user 🔴"
    );

  const users = await Users_DB.query(
    Q.where("id", user_id),
    Q.where("deleted_at", null)
  );

  if (!users?.[0])
    return console.error(
      " 🔴 User not found in WatermelonDB when refreshing zustand user 🔴"
    );

  z_SET_user(users[0]);
}
