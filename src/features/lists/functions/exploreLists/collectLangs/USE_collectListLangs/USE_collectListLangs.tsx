import { useState, useCallback } from "react";
import db, { Lists_DB, Vocabs_DB } from "@/src/db";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { Q } from "@nozbe/watermelondb";
import { VocabTr_TYPE } from "@/src/features/vocabs/types";
import List_MODEL from "@/src/db/models/List_MODEL";

export interface CollectListLangs_PROPS {
  list_id: string | undefined; // ID of the list to collect language IDs from
  onSuccess?: (updated_LIST: List_MODEL) => void; // Callback for successful operation
  cleanup?: () => void; // Cleanup function to call after the operation
}

export function USE_collectListLangs() {
  const [IS_collectingLangs, SET_collectingLangs] = useState(false);
  const [collectLangs_ERROR, SET_collectLangsError] = useState<string | null>(
    null
  );

  const RESET_collectLangsError = useCallback(
    () => SET_collectLangsError(null),
    []
  );

  const errorMessage =
    "An error occurred while collecting language IDs. Please try again.";

  const COLLECT_langs = async ({
    list_id,
    onSuccess,
    cleanup,
  }: CollectListLangs_PROPS): Promise<{
    success: boolean;
    data?: List_MODEL;
    msg?: string;
  }> => {
    SET_collectLangsError(null); // Clear previous error

    if (!list_id) {
      SET_collectLangsError("You must provide a list ID.");
      return {
        success: false,
        msg: "🔴 List ID not provided for collecting languages 🔴",
      };
    }

    SET_collectingLangs(true);
    try {
      // First, find the list by ID
      const list = await Lists_DB.find(list_id);
      if (!list) {
        SET_collectLangsError("List not found.");
        return {
          success: false,
          msg: "🔴 List not found for the provided ID 🔴",
        };
      }

      // Fetch vocabularies associated with the given list_id
      const vocabularies = await Vocabs_DB.query(
        Q.where("list_id", list_id)
      ).fetch();

      // Use a Set to collect unique language IDs
      const langSet = new Set<string>();
      vocabularies.forEach((vocab: Vocab_MODEL) => {
        if (vocab.trs) {
          vocab.trs.forEach((tr: VocabTr_TYPE) => {
            langSet.add(tr.lang_id);
          });
        }
      });

      const collectedLangs = Array.from(langSet);

      // Update the collected language IDs in the list
      await db.write(async () => {
        return await list.update((list: List_MODEL) => {
          list.collected_lang_ids = collectedLangs?.join(",") || "";
        });
      });

      if (onSuccess) onSuccess(list); // Call the success callback with the updated list
      if (cleanup) cleanup(); // Call cleanup if provided

      return { success: true, data: list }; // Return the updated list
    } catch (error: any) {
      console.error("🔴 Error collecting languages 🔴", error.message);
      SET_collectLangsError(errorMessage);

      return {
        success: false,
        msg: `🔴 Unexpected error occurred while collecting languages: ${error.message} 🔴`,
      };
    } finally {
      SET_collectingLangs(false);
    }
  };

  return {
    COLLECT_langs,
    IS_collectingLangs,
    collectLangs_ERROR,
    RESET_collectLangsError,
  };
}
