//
//
//

import { useState } from "react";
import { supabase } from "@/src/lib/supabase"; // Adjust this import based on your project structure

export default function USE_deletePublicVocab() {
  const [IS_deletingPublicVocab, SET_isDeleting] = useState(false);

  const DELETE_publicVocab = async ({
    vocab_id,
  }: {
    vocab_id: string;
  }): Promise<{
    success: boolean;
    msg?: string;
  }> => {
    if (!vocab_id) {
      console.log("🔴 Vocab ID not provided 🔴");
      return {
        success: false,
        msg: "🔴 Vocab ID not provided 🔴",
      };
    }

    try {
      SET_isDeleting(true);

      // First, delete the translations associated with the vocab
      const { error: translationError } = await supabase
        .from("public_translations")
        .delete()
        .eq("public_vocab_id", vocab_id);

      if (translationError) {
        console.log("🔴 Error deleting translations 🔴 : ", translationError);
        return {
          success: false,
          msg: "🔴 Error deleting translations 🔴",
        };
      }

      // Then, delete the vocab itself
      const { error: vocabError } = await supabase
        .from("public_vocabs")
        .delete()
        .eq("id", vocab_id);

      if (vocabError) {
        console.log("🔴 Error deleting public vocab 🔴 : ", vocabError);
        return {
          success: false,
          msg: "🔴 Error deleting public vocab 🔴",
        };
      }

      return {
        success: true,
        msg: "✅ Public vocab and translations deleted successfully ✅",
      };
      // ---------------------------------------------------------------
    } catch (error) {
      console.log(
        "🔴 Error deleting public vocab or translations 🔴 : ",
        error
      );
      return {
        success: false,
        msg: "🔴 Error deleting public vocab or translations 🔴",
      };
    } finally {
      SET_isDeleting(false);
    }
  };

  return { DELETE_publicVocab, IS_deletingPublicVocab };
}
