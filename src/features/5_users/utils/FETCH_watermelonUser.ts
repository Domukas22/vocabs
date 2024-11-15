//
//
//

import { Users_DB } from "@/src/db";
import { Q } from "@nozbe/watermelondb";

export default async function FETCH_watermelonUser(user_id: string) {
  const users = await Users_DB.query(
    Q.where("id", user_id),
    Q.where("deleted_at", null)
  );

  return users?.[0] || undefined;
}
