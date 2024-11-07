import db, { Users_DB, Vocabs_DB } from "@/src/db";
import { useCallback, useMemo, useState } from "react";
import { tr_PROPS } from "@/src/db/props";
import {
  Vocab_MODEL,
  List_MODEL,
  User_MODEL,
} from "@/src/db/watermelon_MODELS";

interface VocabCreation_MODEL {
  user: User_MODEL | undefined;
  list_id: string | undefined;
  difficulty?: 1 | 2 | 3;
  description?: string | "";
  translations: tr_PROPS[] | undefined;
  onSuccess: (new_VOCAB: Vocab_MODEL) => void;
}

export default function USE_createVocab() {
  const [IS_creatingVocab, SET_isCreatingVocab] = useState(false);
  const [db_ERROR, SET_error] = useState<string | null>(null);
  const RESET_dbError = useCallback(() => SET_error(null), []);

  const errorMessage = useMemo(
    () =>
      "Some kind of error happened when trying to create the vocab. This is an issue on our side. Please try to reload the app and see if the problem persists. The issue has been recorded and will be reviewed by developers. We apologize for the trouble.",
    []
  );

  const CREATE_vocab = async ({
    user,
    list_id,
    difficulty,
    description,
    translations,
    onSuccess,
  }: VocabCreation_MODEL): Promise<{
    success: boolean;
    data?: any;
    msg?: string;
  }> => {
    SET_error(null); // Clear any previous error

    if (!user || !user?.id) {
      SET_error(errorMessage);
      return {
        success: false,
        msg: "🔴 User is required for creating private vocabs 🔴",
      };
    }
    if (!list_id) {
      SET_error(errorMessage);
      return {
        success: false,
        msg: "🔴 List is required for creating private vocabs 🔴",
      };
    }

    const DOES_thisVocabBreachMaxCount = await user.ARE_vocabsWithinMaxRange(1);

    if (!DOES_thisVocabBreachMaxCount) {
      SET_error(
        `You have reached your maximum vocab limit of ${user.max_vocabs}. Please go to the 'General' tab to learn more.`
      );
      return {
        success: false,
        msg: `🔴 You have reached your maximum vocab limit of ${user.max_vocabs}. Please go to the 'General' tab to learn more. 🔴`,
      };
    }

    try {
      SET_isCreatingVocab(true);

      const newVocab = await db.write(async () => {
        const vocab = await Vocabs_DB.create((vocab: Vocab_MODEL) => {
          vocab.user_id = user.id;
          vocab.list_id = list_id;

          vocab.difficulty = difficulty || 3;
          vocab.description = description || "";

          vocab.trs = translations;
          vocab.lang_ids = translations?.map((t) => t.lang_id).join(",");
          vocab.searchable = translations?.map((t) => t.text).join(",");

          vocab.is_marked = false;
        });

        return vocab;
      });

      // Success handling
      if (onSuccess) {
        onSuccess(newVocab);
      }

      return { success: true, data: newVocab };
    } catch (error: any) {
      if (error.message === "Failed to fetch") {
        SET_error(
          "It looks like there's an issue with your internet connection. Please check your connection and try again."
        );
      } else {
        SET_error(errorMessage);
      }
      return {
        success: false,
        msg: `🔴 Unexpected error occurred during vocab creation 🔴: ${error.message}`,
      };
    } finally {
      SET_isCreatingVocab(false);
    }
  };

  return { CREATE_vocab, IS_creatingVocab, db_ERROR, RESET_dbError };
}
