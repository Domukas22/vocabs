import { useState, useCallback, useMemo } from "react";
import db, { Lists_DB, Vocabs_DB } from "@/src/db";
import {
  List_MODEL,
  User_MODEL,
  Vocab_MODEL,
} from "@/src/db/watermelon_MODELS";
import { supabase } from "@/src/lib/supabase";

interface CopyListAndVocabs_PROPS {
  list: List_MODEL | undefined;
  user_id: string | undefined;
  onSuccess?: (new_LIST: List_MODEL) => void;
}

export default function USE_copyListAndItsVocabs() {
  const [IS_copyingList, SET_isCopyingList] = useState(false);
  const [copyList_ERROR, SET_copyListError] = useState<string | null>(null);

  const RESET_copyListError = useCallback(() => SET_copyListError(null), []);

  const errorMessage = useMemo(
    () =>
      "An error occurred while trying to copy the list and its vocabs. Please try again later. The issue has been reported and will be reviewed by developers. Sorry for the inconvenience.",
    []
  );

  const COPY_listAndVocabs = async ({
    list,
    user_id,
    onSuccess,
  }: CopyListAndVocabs_PROPS): Promise<{
    success: boolean;
    new_LIST?: List_MODEL;
    msg?: string;
  }> => {
    try {
      SET_copyListError(null);

      // Validation checks
      if (!list) {
        const errorMsg = "You must provide a valid list.";
        SET_copyListError(errorMsg);
        return {
          success: false,
          msg: `🔴 ${errorMsg} 🔴`,
        };
      }

      if (!user_id) {
        const errorMsg = "You must be logged in to copy a list.";
        SET_copyListError(errorMsg);
        return {
          success: false,
          msg: `🔴 ${errorMsg} 🔴`,
        };
      }

      SET_isCopyingList(true);

      // Create the new list based on the provided list
      const new_LIST = await db.write(async () => {
        const copiedList = await Lists_DB.create((newList: List_MODEL) => {
          // Copy relevant fields from the existing list
          newList.user_id = user_id;
          newList.original_creator_id = user_id;

          newList.name = list.name;
          newList.description = list.description;
          newList.is_submitted_for_publish = false; // Set to false initially for a private copy
          newList.was_accepted_for_publish = false;
          newList.type = "private";
          newList.default_lang_ids = list.default_lang_ids;
          newList.collected_lang_ids = list.collected_lang_ids;
        });

        // Fetch vocabs for the list from Supabase
        const { data: vocabsToCopy, error: fetchError } = await supabase
          .from("vocabs")
          .select("*")
          .eq("list_id", list.id);

        if (fetchError) {
          throw new Error(`Failed to fetch vocabs: ${fetchError.message}`);
        }

        // Check if any vocabs were fetched
        if (!vocabsToCopy || vocabsToCopy.length === 0) {
          throw new Error("No vocabs found to copy.");
        }

        // Copy each vocab to the newly created list
        await Promise.all(
          vocabsToCopy.map((vocab: Vocab_MODEL) =>
            Vocabs_DB.create((newVocab: Vocab_MODEL) => {
              // newVocab.list_id = copiedList.id;

              newVocab.user_id = user_id;
              newVocab.list_id = copiedList.id;
              newVocab.difficulty = 3;
              newVocab.description = vocab.description;
              newVocab.trs = vocab.trs;
              newVocab.lang_ids = vocab.lang_ids;
              newVocab.searchable = vocab.searchable;
              newVocab.is_marked = false;
            })
          )
        );

        return copiedList;
      });

      if (onSuccess) onSuccess(new_LIST);
      return { success: true, new_LIST };
    } catch (error: any) {
      console.error("Error copying list and vocabs:", error.message);
      SET_copyListError(error.message); // Store the error message in state
      return {
        success: false,
        msg: `🔴 Error copying list and vocabs: ${error.message} 🔴`,
      };
    } finally {
      SET_isCopyingList(false); // Reset copying state
    }
  };

  return {
    COPY_listAndVocabs,
    IS_copyingList,
    copyList_ERROR,
    RESET_copyListError,
  };
}
