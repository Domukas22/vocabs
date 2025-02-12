import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import List_MODEL from "@/src/db/models/List_MODEL";
import User_MODEL from "@/src/db/models/User_MODEL";

import { CREATE_internalErrorMsg } from "@/src/constants/globalVars";
import { SEND_internalError } from "@/src/utils";
import { Error_PROPS } from "@/src/types/error_TYPES";
import { CHECK_ifNetworkFailure } from "@/src/utils";

export interface ShareList_PROPS {
  list: List_MODEL | undefined;
  user: User_MODEL | undefined;
  val: boolean;
  sync: () => Promise<void>;
}

const internal_ERROR = {
  msg: CREATE_internalErrorMsg("trying to share this list"),
  type: "internal",
};
const networkFailure_RESPONSE = {
  msg: "Sharing a list requires you to be online. There seems to be an issue with your internet connection.",
  type: "user",
};
async function SEND_error(message: string, details?: Object) {
  await SEND_internalError({
    message,
    function_NAME: "USE_shareList --> SHARE_list",
    details,
  });
}

export function USE_shareList() {
  const [IS_sharing, SET_isSharing] = useState(false);
  const [error, SET_error] = useState<Error_PROPS>();
  const [success, SET_success] = useState(false);

  const SHARE_list = async (data: ShareList_PROPS) => {
    const { list, user, val, sync } = data;

    try {
      SET_isSharing(true);
      SET_success(false);
      SET_error(undefined);

      if (!sync) {
        await SEND_error(
          "Sync function not provided when trying to share/unshare list"
        );
        SET_error(internal_ERROR);
        return;
      }

      await sync();

      if (!user || !user?.id) {
        await SEND_error(
          "User object undefined when trying to share/unshare list"
        );
        SET_error(internal_ERROR);
        return;
      }

      if (!list || !list.id) {
        await SEND_error(
          "List object undefined when trying to share/unshare list"
        );
        SET_error(internal_ERROR);
        return;
      }

      if (!list.user_id) {
        await SEND_error(
          "List doesn't point to any user when trying to share/unshare list"
        );
        SET_error(internal_ERROR);
        return;
      }

      if (user.id !== list.user_id) {
        await SEND_error(
          "'user.id' and 'list.user_id' don't seem to match when trying to share/unshare list"
        );

        SET_error(internal_ERROR);
        return;
      }

      const sharedList_NAMES = await user.FETCH_sharedListNames({
        excluded_ID: list.id,
      });

      if (sharedList_NAMES?.length >= 10) {
        SET_error({
          message: `You already have 10 shared lists, which is the limit for a single account.`,
          type: "user",
        });
        return;
      }

      const { error: updateList_ERROR } = await supabase
        .from("lists")
        .update({ type: val ? "shared" : "private" })
        .eq("id", list.id)
        .eq("user_id", user.id)
        .select("*")
        .single();

      if (updateList_ERROR) {
        const IS_networkFailure = CHECK_ifNetworkFailure(updateList_ERROR);
        if (IS_networkFailure) {
          SET_error(networkFailure_RESPONSE);
          return;
        }

        await SEND_error(
          "Error updating property 'type' on supabase when sharing a list",
          updateList_ERROR
        );
        SET_error(internal_ERROR);
        return;
      }

      if (!val && !updateList_ERROR) {
        // delete list accesses if unsharing a list
        const { error: deleteListAccesses_ERROR } = await supabase
          .from("list_accesses")
          .delete()
          .eq("list_id", list.id);
        if (deleteListAccesses_ERROR) {
          await SEND_error(
            "Error deleting list accesses on supabase when unsharing a list",
            deleteListAccesses_ERROR
          );
        }
      }

      SET_success(true);
    } catch (err: any) {
      const IS_networkFailure = CHECK_ifNetworkFailure(err);
      if (IS_networkFailure) {
        SET_error(networkFailure_RESPONSE);
        return;
      }

      await SEND_error(
        "Error updating property 'type' on supabase when sharing a list",
        error
      );
      SET_error(internal_ERROR);
      return;
    } finally {
      await sync();
      SET_isSharing(false);
    }
  };

  return {
    SHARE_list,
    IS_sharing,
    listSharing_SUCCESS: success,
    listSharing_ERROR: error,
  };
}
