//
//
//

import { PUSH_changes, sync } from "@/src/db/sync";
import USE_zustand from "@/src/zustand";

export default function USE_sync() {
  const { z_user, z_SET_user } = USE_zustand();

  const SYNC = async (pull_type: "all" | "updates" = "updates") => {
    if (!z_user) return { success: false };

    const { success, error, internal_MSG } = await sync(pull_type, z_user);

    if (success) {
      const updated_USER = await z_user?.UPDATE_lastPulledAt();

      if (updated_USER) {
        z_SET_user(updated_USER);
        const { success: push_SUCCESS } = await PUSH_changes();

        if (push_SUCCESS) {
          return { success: true };
        } else return { success: false };
      } else return { success: false };
    } else return { success: false };
  };

  return { SYNC };
}
