import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import USE_zustand from "@/src/zustand";
import { useToast } from "react-native-toast-notifications";
import { useTranslation } from "react-i18next";

export default function USE_updateVocabDifficulty() {
  const [IS_updatingVocabDifficulty, SET_updatingVocabDifficulty] =
    useState(false);
  const [updateVocabDifficulty_ERROR, SET_updateVocabDifficultyError] =
    useState<string | null>(null);
  const toast = useToast();
  const { t } = useTranslation();

  const { z_UPDATE_vocabDifficulty } = USE_zustand();

  const UPDATE_vocabDifficulty = async (
    list_ID: string,
    vocab_ID: string,
    newDifficulty: 1 | 2 | 3
  ): Promise<{
    success: boolean;
    msg?: string;
  }> => {
    try {
      SET_updatingVocabDifficulty(true);
      SET_updateVocabDifficultyError(null); // Reset error state before updating vocab difficulty

      const { error } = await supabase
        .from("vocabs")
        .update({ difficulty: newDifficulty })
        .eq("id", vocab_ID)
        .eq("list_id", list_ID); // Ensure vocab belongs to the correct list

      // Handle potential errors
      if (error) {
        console.error("🔴 Error updating vocab difficulty: 🔴", error);
        SET_updateVocabDifficultyError("🔴 Error updating vocab difficulty 🔴");
        return { success: false, msg: "🔴 Error updating vocab difficulty 🔴" };
      }

      z_UPDATE_vocabDifficulty(list_ID, vocab_ID, newDifficulty);
      console.log("🟢 Vocab difficulty updated 🟢");
      toast.show(t("notifications.vocabDifficultyUpdated"), {
        type: "custom_success",
        duration: 2000,
      });

      return { success: true, msg: "🟢 Vocab difficulty updated 🟢" };
    } catch (error) {
      console.error("🔴 Unexpected error updating vocab difficulty: 🔴", error);
      SET_updateVocabDifficultyError("🔴 Unexpected error occurred. 🔴");
      return { success: false, msg: "🔴 Unexpected error occurred. 🔴" };
    } finally {
      SET_updatingVocabDifficulty(false); // Always stop loading after the request
    }
  };

  return {
    UPDATE_vocabDifficulty,
    IS_updatingVocabDifficulty,
    updateVocabDifficulty_ERROR,
  };
}
