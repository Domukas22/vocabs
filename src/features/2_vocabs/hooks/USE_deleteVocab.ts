//
//
//

import { User_MODEL } from "@/src/db/watermelon_MODELS";
import { supabase } from "@/src/lib/supabase";
import { useCallback, useMemo, useState } from "react";

interface VocabDelete_PROPS {
  user?: User_MODEL;
  vocab_id: string;
  list_id?: string;
  is_public: boolean;
  onSuccess?: () => void;
}

export default function USE_deleteVocab() {
  const [IS_deletingVocab, SET_isDeletingVocab] = useState(false);
  const [error, SET_error] = useState<string | null>(null);
  const RESET_error = useCallback(() => SET_error(null), []);

  const errorMessage = useMemo(
    () =>
      "Some kind of error happened when trying to delete the vocab. This is an issue on our side. Please try to re-load the app and see if the problem persists. The issue has been recorded and will be reviewed by developers as soon as possible. We are sorry for the trouble.",
    []
  );

  const DELETE_vocab = async ({
    user,
    vocab_id,
    list_id,
    is_public,
    onSuccess,
  }: VocabDelete_PROPS) => {
    SET_error(null); // Clear previous error

    // Validation checks
    if (!vocab_id) {
      SET_error(errorMessage);
      return { success: false, msg: "🔴 Vocab ID not provided 🔴" };
    }

    if (is_public && !user?.is_admin) {
      SET_error("Only admins can delete public vocabs.");
      return {
        success: false,
        msg: "🔴 Admin privileges are required to delete public vocab 🔴",
      };
    }

    if (!is_public) {
      if (!user?.id) {
        SET_error(errorMessage);
        return {
          success: false,
          msg: "🔴 User ID missing for private vocab deletion 🔴",
        };
      }
      if (!list_id) {
        SET_error(errorMessage);
        return {
          success: false,
          msg: "🔴 List ID missing for private vocab deletion 🔴",
        };
      }
    }

    SET_isDeletingVocab(true);
    try {
      // If the vocab is public, validate that it exists with both vocab_id and is_public = true
      if (is_public && user?.is_admin) {
        const { data: publicVocab, error: publicVocabError } = await supabase
          .from("vocabs")
          .select()
          .eq("id", vocab_id)
          .eq("is_public", true)
          .single();

        if (publicVocabError) {
          SET_error(errorMessage);
          return {
            success: false,
            msg: `🔴 Error fetching public vocab with ID ${vocab_id} 🔴: ${publicVocabError.message}`,
          };
        }

        if (!publicVocab) {
          SET_error(
            "It seems this public vocabulary has already been deleted or could not be found."
          );
          return {
            success: false,
            msg: `🔴 Public vocab with ID ${vocab_id} not found 🔴`,
          };
        }
      }

      // If the vocab is private, validate that it exists with both vocab_id and user?.id
      if (!is_public) {
        const { data: privateVocab, error: privateVocabError } = await supabase
          .from("vocabs")
          .select()
          .eq("id", vocab_id)
          .eq("user_id", user?.id)
          .single();

        if (privateVocabError) {
          SET_error(errorMessage);
          return {
            success: false,
            msg: `🔴 Error fetching private vocab with ID ${vocab_id} for user ${user?.id} 🔴: ${privateVocabError.message}`,
          };
        }

        if (!privateVocab) {
          SET_error(
            "It seems this vocab has already been deleted or could not be found."
          );
          return {
            success: false,
            msg: `🔴 Private vocab with ID ${vocab_id} not found for user ${user?.id} 🔴`,
          };
        }
      }

      // Delete associated translations
      const { error: translationError } = await supabase
        .from("translations")
        .delete()
        .eq("vocab_id", vocab_id);

      if (translationError) {
        SET_error(errorMessage);
        return {
          success: false,
          msg: `🔴 Error deleting translations for vocab ID ${vocab_id} 🔴: ${translationError.message}`,
        };
      }

      // Delete the vocab
      const { data: deletedVocabData, error: vocabError } = await supabase
        .from("vocabs")
        .delete()
        .eq("id", vocab_id)
        .select()
        .single();

      if (vocabError) {
        SET_error(errorMessage);
        return {
          success: false,
          msg: `🔴 Error deleting vocab with ID ${vocab_id} 🔴: ${vocabError.message}`,
        };
      }

      console.log("🟢 Vocab and translations deleted successfully 🟢");
      if (onSuccess) onSuccess();

      return { success: true, data: deletedVocabData };
    } catch (error: any) {
      // Handle network or connection errors differently
      if (error.message === "Failed to fetch") {
        SET_error(
          "It looks like there's an issue with your internet connection. Please check your connection and try again."
        );
      } else {
        SET_error(errorMessage);
      }
      return {
        success: false,
        msg: `🔴 Unexpected error occurred during deletion of vocab ID ${vocab_id} 🔴: ${error.message}`,
      };
    } finally {
      SET_isDeletingVocab(false);
    }
  };

  return { DELETE_vocab, IS_deletingVocab, error, RESET_error };
}
