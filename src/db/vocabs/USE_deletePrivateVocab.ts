//
//
//

import { useState } from "react";
import { supabase } from "@/src/lib/supabase"; // Adjust this import based on your project structure

export default function USE_deletePrivateVocab() {
  const [IS_deleting, SET_isDeleting] = useState(false);

  const DELETE_privateVocab = async ({
    vocab_id,
    toggleFn = () => {},
  }: {
    vocab_id: string;
    toggleFn?: () => void;
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
        .from("translations")
        .delete()
        .eq("vocab_id", vocab_id);

      if (translationError) {
        console.log("🔴 Error deleting translations 🔴 : ", translationError);
        return {
          success: false,
          msg: "🔴 Error deleting translations 🔴",
        };
      }

      // Then, delete the vocab itself
      const { error: vocabError } = await supabase
        .from("vocabs")
        .delete()
        .eq("id", vocab_id);

      if (vocabError) {
        console.log("🔴 Error deleting vocab 🔴 : ", vocabError);
        return {
          success: false,
          msg: "🔴 Error deleting vocab 🔴",
        };
      }

      toggleFn(); // Trigger any optional callback, e.g., UI refresh
      return {
        success: true,
        msg: "✅ Vocab and translations deleted successfully ✅",
      };
    } catch (error) {
      console.log("🔴 Error deleting vocab or translations 🔴 : ", error);
      return {
        success: false,
        msg: "🔴 Error deleting vocab or translations 🔴",
      };
    } finally {
      SET_isDeleting(false);
    }
  };

  return { DELETE_privateVocab, IS_deleting };
}
