import db, { Users_DB, Vocabs_DB } from "@/src/db";
import { useCallback, useMemo, useState } from "react";
import { tr_PROPS } from "@/src/db/props";
import {
  Vocab_MODEL,
  List_MODEL,
  User_MODEL,
} from "@/src/db/watermelon_MODELS";

interface VocabCreation_MODEL {
  user?: User_MODEL | undefined;
  list?: List_MODEL | undefined;
  difficulty?: 1 | 2 | 3;
  description?: string | "";
  translations: tr_PROPS[] | undefined;
  is_public?: boolean;
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
    list,
    difficulty,
    description,
    translations,
    is_public = false,
    onSuccess,
  }: VocabCreation_MODEL): Promise<{
    success: boolean;
    data?: any;
    msg?: string;
  }> => {
    SET_error(null); // Clear any previous error

    // Initial validation checks
    if (is_public && !user?.is_admin) {
      SET_error("Only admins can create public vocabs.");
      return {
        success: false,
        msg: "🔴 Only admins can create public vocabs 🔴",
      };
    }

    if (!is_public) {
      if (!user?.id) {
        SET_error(errorMessage);
        return {
          success: false,
          msg: "🔴 User ID is required for creating private vocabs 🔴",
        };
      }

      if (!list || !list.id) {
        SET_error(errorMessage);
        return {
          success: false,
          msg: "🔴 List is required for creating private vocabs 🔴",
        };
      }
    }

    try {
      SET_isCreatingVocab(true);

      const user_db = await Users_DB.find(user?.id || "");
      if (!user) throw new Error("🔴 User not found in Watermelon 🔴");
      const newVocab = await db.write(async () => {
        const vocab = await Vocabs_DB.create((vocab: Vocab_MODEL) => {
          vocab.user?.set(is_public ? null : user_db);
          vocab.list?.set(is_public ? null : list);
          vocab.difficulty = difficulty || 3;
          vocab.description = description || "";
          vocab.is_public = is_public;
          vocab.trs = translations;
          vocab.lang_ids = translations?.map((t) => t.lang_id).join(",");
          vocab.searchable = translations?.map((t) => t.text).join(",");
        });

        return vocab;
      });

      // Success handling
      if (onSuccess) {
        onSuccess(newVocab);
      }
      console.log("🟢 Vocab created successfully 🟢");

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
