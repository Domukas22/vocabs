//
//
//

import { useState } from "react";
import { supabase } from "@/src/lib/supabase"; // Adjust this import based on your project structure

export default function USE_deletePublicVocab() {
  const [IS_deletingPublicVocab, SET_isDeletingPublicVocab] = useState(false);

  const DELETE_publicVocab = async ({
    public_vocab_id,
    toggleFn = () => {},
  }: {
    public_vocab_id: string;
    toggleFn?: () => void;
  }): Promise<{
    success: boolean;
    msg?: string;
  }> => {
    if (!public_vocab_id) {
      console.log("🔴 Public vocab ID not provided 🔴");
      return {
        success: false,
        msg: "🔴 Public vocab not provided 🔴",
      };
    }

    try {
      SET_isDeletingPublicVocab(true);

      // First, delete the translations associated with the vocab
      const { error: translationError } = await supabase
        .from("public_translations")
        .delete()
        .eq("public_vocab_id", public_vocab_id);

      if (translationError) {
        console.log(
          "🔴 Error deleting public translations 🔴 : ",
          translationError
        );
        return {
          success: false,
          msg: "🔴 Error deleting public translations 🔴",
        };
      }

      // Then, delete the vocab itself
      const { error: vocabError } = await supabase
        .from("public_vocabs")
        .delete()
        .eq("id", public_vocab_id);

      if (vocabError) {
        console.log("🔴 Error deleting public vocab 🔴 : ", vocabError);
        return {
          success: false,
          msg: "🔴 Error deleting public vocab 🔴",
        };
      }

      toggleFn(); // Trigger any optional callback, e.g., UI refresh
      return {
        success: true,
        msg: "✅ Public Vocab and translations deleted successfully ✅",
      };
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
      SET_isDeletingPublicVocab(false);
    }
  };

  return { DELETE_publicVocab, IS_deletingPublicVocab };
}
