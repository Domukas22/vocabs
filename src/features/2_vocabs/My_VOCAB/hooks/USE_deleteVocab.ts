import { supabase } from "@/src/lib/supabase"; // Adjust this import based on your project structure
import { useState } from "react";
import { Vocab_MODEL } from "../../../../db/models";

interface VocabDelete_PROPS {
  vocab_id: string;
  user_id?: string; // User ID can be optional for public vocab
  list_id?: string; // List ID can be optional for public vocab
  is_public: boolean;
  is_admin: boolean;
}

export default function USE_deleteVocab() {
  const [IS_deletingVocab, SET_isDeletingVocab] = useState(false);

  const DELETE_vocab = async (
    props: VocabDelete_PROPS
  ): Promise<{
    success: boolean;
    data?: Vocab_MODEL | null;
    msg?: string;
  }> => {
    const { vocab_id, user_id, list_id, is_public, is_admin } = props;

    // Step 1: Check if vocab ID is provided
    if (!vocab_id) {
      const errorMsg = "🔴 Vocab ID not provided 🔴";
      console.log(errorMsg);
      return {
        success: false,
        msg: errorMsg,
      };
    }

    // Step 2: If the vocab is public, check if the user is an admin
    if (is_public) {
      if (!is_admin) {
        const errorMsg =
          "🔴 Cannot delete a public vocab without admin privileges 🔴";
        console.log(errorMsg);
        return {
          success: false,
          msg: errorMsg,
        };
      }
      // If admin, skip user_id and list_id validation
    } else {
      // Step 3: If vocab is private, ensure user_id and list_id are provided
      if (!user_id) {
        const errorMsg = "🔴 User ID not provided for private vocab 🔴";
        console.log(errorMsg);
        return {
          success: false,
          msg: errorMsg,
        };
      }

      if (!list_id) {
        const errorMsg = "🔴 List ID not provided for private vocab 🔴";
        console.log(errorMsg);
        return {
          success: false,
          msg: errorMsg,
        };
      }
    }

    try {
      SET_isDeletingVocab(true);

      // Step 4: Delete the translations associated with the vocab
      const { error: translationError } = await supabase
        .from("translations")
        .delete()
        .eq("vocab_id", vocab_id);

      if (translationError) {
        const errorMsg = `🔴 Error deleting translations 🔴: ${translationError.message}`;
        console.log(errorMsg);
        return {
          success: false,
          msg: errorMsg,
        };
      }

      // Step 5: Delete the vocab itself
      const { data: deletedVocabData, error: vocabError } = await supabase
        .from("vocabs")
        .delete()
        .eq("id", vocab_id)
        .select()
        .single();

      if (vocabError) {
        const errorMsg = `🔴 Error deleting vocab 🔴: ${vocabError.message}`;
        console.log(errorMsg);
        return {
          success: false,
          msg: errorMsg,
        };
      }

      // Step 6: Return success response
      const successMsg = "✅ Vocab and translations deleted successfully ✅";
      console.log(successMsg);
      return {
        success: true,
        data: deletedVocabData,
        msg: successMsg,
      };
    } catch (error) {
      const errorMsg = `🔴 Error deleting vocab or translations 🔴: ${error.message}`;
      console.log(errorMsg);
      return {
        success: false,
        msg: errorMsg,
      };
    } finally {
      SET_isDeletingVocab(false);
    }
  };

  return { DELETE_vocab, IS_deletingVocab };
}
