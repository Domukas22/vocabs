//
//
//

import { supabase } from "@/src/lib/supabase";
import { useState } from "react";

export default function USE_editVocabDifficulty(toggle: () => void = () => {}) {
  const [LOADING_colorEdit, setLoading] = useState<{
    loading: boolean;
    difficulty: 1 | 2 | 3 | null;
  }>({
    loading: false,
    difficulty: null,
  });

  const EDIT_color = async ({
    id,
    newDifficulty,
  }: {
    id: string;
    newDifficulty: 1 | 2 | 3;
  }) => {
    setLoading({ loading: true, difficulty: newDifficulty });

    try {
      const { data, error } = await supabase
        .from("vocabs")
        .update({ difficulty: newDifficulty })
        .eq("id", id);

      if (error) {
        console.log("🔴 Error updating vocab difficulty 🔴 : ", error);
        return { success: false, msg: "🔴 Error updating vocab difficulty 🔴" };
      }

      // Update the loading state with the new difficulty
      toggle();
      setLoading({ loading: false, difficulty: null });
      return { success: true, data };
    } catch (error) {
      console.log("🔴 Error updating vocab difficulty 🔴 : ", error);
      return { success: false, msg: "🔴 Error updating vocab difficulty 🔴" };
    } finally {
      // Reset loading state in case of errors
      if (LOADING_colorEdit.loading) {
        setLoading({
          loading: false,
          difficulty: null,
        });
      }
    }
  };

  return { EDIT_color, LOADING_colorEdit };
}
