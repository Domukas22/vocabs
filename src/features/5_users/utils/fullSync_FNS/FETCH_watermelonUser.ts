//
//
//

import { ListAccess_DB, Lists_DB, Users_DB } from "@/src/db";
import { Q } from "@nozbe/watermelondb";

export default async function FETCH_watermelonUser(user_id: string) {
  try {
    if (!user_id) {
      throw new Error("🔴 User ID not defined for fetching watermelon user 🔴");
    }

    const user = await Users_DB.query(Q.where("id", user_id));

    return { success: true, data: user?.[0] };
  } catch (error) {
    console.error("🔴 Error fetching watermelon user 🔴", error);

    return { success: false, error };
  }
}
