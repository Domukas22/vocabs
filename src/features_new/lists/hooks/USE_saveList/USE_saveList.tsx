//
//
//

import { FormInput_ERROR, General_ERROR } from "@/src/types/error_TYPES";
import { SEND_internalError } from "@/src/utils";
import { useCallback, useState } from "react";
import { t } from "i18next";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { USE_celebrate, USE_error } from "@/src/hooks";
import { CAN_userCreateThisAmountOfVocabs } from "@/src/features_new/vocabs/functions/CAN_userCreateThisAmountOfVocabs/CAN_userCreateThisAmountOfVocabs";
import { FETCH_onePublicList, FETCH_vocabsOfPublicList } from "./helpers";
import { FETCH_vocabCountOfPublicList } from "./helpers/FETCH_vocabCountOfPublicList/FETCH_vocabCountOfPublicList";
import { CREATE_copiedList } from "./helpers/CREATE_copiedList/CREATE_copiedList";
import { supabase } from "@/src/lib/supabase";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { COPY_vocabsOfAPublicList } from "./helpers/COPY_vocabsOfAPublicList/COPY_vocabsOfAPublicList";
import { List_EVENTS, Vocab_EVENTS } from "@/src/mitt/mitt";

const function_NAME = "USE_saveList";

// 🔴🔴 TODO --> Finish

export function USE_saveList() {
  const { z_user } = z_USE_user();
  const { celebrate } = USE_celebrate();
  const { error, SET_error, RESET_error } = USE_error<
    General_ERROR | FormInput_ERROR | undefined
  >();
  const [loading, SET_loading] = useState(false);

  const _SAVE_list = useCallback(
    async (publicList_ID: string, onSuccess: () => void) => {
      // fetch the total vocab count of target list
      // check if user can afford the vocabs with max_vocabs
      // fetch the public list
      // fetch the vocabs of the public list
      // create list
      // create vocabs
      // increase max_user count

      try {
        if (loading) return;
        SET_error(undefined);
        SET_loading(true);

        // ------------------------------------------------------------
        // Fetch total vocab count of a list
        const { count } = await FETCH_vocabCountOfPublicList(publicList_ID);

        // ------------------------------------------------------------
        // Can the user afford to create that many vocabs?
        const { allow, max_vocabs } = await CAN_userCreateThisAmountOfVocabs(
          z_user?.id || "",
          count
        );

        // If not, throw error
        if (!allow)
          throw new FormInput_ERROR({
            user_MSG: `You have reached your vocabulary limit of ${max_vocabs}. Go to the "General" tab to get more vocabs.`,
            falsyForm_INPUTS: [{ input_NAME: "list", message: "..." }],
          });

        // ------------------------------------------------------------
        // Fetch the public list
        const { list } = await FETCH_onePublicList(publicList_ID);

        // Fetch vocabs of target list
        const { vocabs } = await FETCH_vocabsOfPublicList(publicList_ID);

        // create list, and use it's id / name
        const { new_LIST } = await CREATE_copiedList(
          {
            collected_lang_ids: list.collected_lang_ids,
            default_lang_ids: list.default_lang_ids,
            description: list.description,
            name: list.name,
          },
          z_user?.id || ""
        );

        const toInsert_LIST = {
          ...new_LIST,
          vocab_infos: {
            marked: 0,
            diff_1: 0,
            diff_2: 0,
            diff_3: list.vocab_infos.total,
            total: list.vocab_infos.total,
          },
        };

        await COPY_vocabsOfAPublicList({
          oldList_id: list.id,
          newList_id: toInsert_LIST.id,
          user_id: z_user?.id || "",
        });

        console.log("NEW LISTL ", toInsert_LIST);

        // create the vocabs, make sure to use the list id of the new lsit

        // --------------------------------------------------

        List_EVENTS.emit("copied", toInsert_LIST);

        // onSuccess();
        celebrate(t("notification.listCopied"));
        // -----------------------------
      } catch (error: any) {
        // HANDLE_formInputError(error);
        if (Object.hasOwn(error, "falsyForm_INPUTS")) {
          SET_error(error);
          return;
        }

        const err = new General_ERROR({
          function_NAME: error?.function_NAME || function_NAME,
          message: error?.message,
          errorToSpread: error,
        });

        SET_error(err);
        SEND_internalError(err);
      } finally {
        SET_loading(false);
      }
    },
    [loading, z_user?.id, celebrate, SET_error, SET_loading]
  );

  return {
    SAVE_list: _SAVE_list,
    loading,
    error,
    RESET_error,
  };
}
