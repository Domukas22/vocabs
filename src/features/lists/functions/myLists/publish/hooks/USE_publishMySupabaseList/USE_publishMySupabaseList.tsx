import { CREATE_internalErrorMsg } from "@/src/constants/globalVars";
import List_MODEL from "@/src/db/models/List_MODEL";
import User_MODEL from "@/src/db/models/User_MODEL";
import { supabase } from "@/src/lib/supabase";
import { Error_PROPS } from "@/src/props";
import { CHECK_ifNetworkFailure } from "@/src/utils";
import { SEND_internalError } from "@/src/utils";
import { useState } from "react";

interface PublishMySupabaseList_PROPS {
  list: List_MODEL | undefined;
  user: User_MODEL | undefined;
  val: boolean;
  sync: () => Promise<void>;
}

const internal_ERROR = {
  msg: CREATE_internalErrorMsg("trying to submit this list for publishing"),
  type: "internal",
};
const networkFailure_RESPONSE = {
  msg: "Submitting a list for publishing requires you to be online. There seems to be an issue with your internet connection.",
  type: "user",
};
async function SEND_error(message: string, details?: Object) {
  await SEND_internalError({
    message,
    function_NAME: "USE_publishMySupabaseList --> PUBLISH_list",
    details,
  });
}

export function USE_publishMySupabaseList() {
  const [IS_publishing, SET_isPublishing] = useState(false);
  const [error, SET_error] = useState<Error_PROPS>();
  const [success, SET_success] = useState(false);

  async function PUBLISH_list(data: PublishMySupabaseList_PROPS) {
    const { list, user, val, sync } = data;

    try {
      SET_isPublishing(true);
      SET_success(false);
      SET_error(undefined);

      if (!sync) {
        await SEND_error(
          "Sync function not provided when submitting list for publishing"
        );
        SET_error(internal_ERROR);
        return;
      }

      await sync();

      if (!user || !user?.id) {
        await SEND_error(
          "User object undefined when submitting list for publishing"
        );
        SET_error(internal_ERROR);
        return;
      }

      if (!list || !list.id) {
        await SEND_error(
          "List object undefined when submitting list for publishing"
        );
        SET_error(internal_ERROR);
        return;
      }

      if (!list.user_id) {
        await SEND_error(
          "List doesn't point to any user when submitting list for publishing"
        );
        SET_error(internal_ERROR);
        return;
      }

      if (user.id !== list.user_id) {
        await SEND_error(
          "'user.id' and 'list.user_id' don't seem to match when submitting list for publishing"
        );

        SET_error(internal_ERROR);
        return;
      }
      if (list.was_accepted_for_publish) {
        SET_error({
          message:
            "This list was already submitted and accepted for pubslishing.",
          type: "user",
        });
        return;
      }

      const alreadySubmittedforPublishingList_NAMES =
        await user.FETCH_listNamesSubmittedForPublishing({
          excluded_ID: list.id,
        });

      if (alreadySubmittedforPublishingList_NAMES?.length > 0) {
        SET_error({
          message: `You already have a list named '${alreadySubmittedforPublishingList_NAMES[0]}' submitted for publishing. You can only have one list submitted for publishing at a time.`,
          type: "user",
        });
        return;
      }

      const { error } = await supabase
        .from("lists")
        .update({ is_submitted_for_publish: val || false })
        .eq("id", list.id);

      if (error) {
        const IS_networkFailure = CHECK_ifNetworkFailure(error);
        if (IS_networkFailure) {
          SET_error(networkFailure_RESPONSE);
          return;
        }

        await SEND_error(
          "Error updating property 'is_submitted_for_publish' on supabase",
          error
        );

        SET_error(internal_ERROR);
        return;
      }

      SET_success(true);
    } catch (err: any) {
      const IS_networkFailure = CHECK_ifNetworkFailure(err);
      if (IS_networkFailure) {
        SET_error(networkFailure_RESPONSE);
        return;
      }

      await SEND_error(
        "Error updating property 'is_submitted_for_publish' on supabase",
        err
      );
      SET_error(internal_ERROR);
      return;
    } finally {
      await sync();
      SET_isPublishing(false);
    }
  }

  return {
    PUBLISH_list,
    IS_publishing,
    listPublish_SUCCESS: success,
    listPublish_ERROR: error,
  };
}
