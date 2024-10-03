import { supabase } from "@/src/lib/supabase";
import USE_zustand from "@/src/zustand";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";

export interface privateVocabDifficultyEdit_PROPS {
  loading: boolean;
  targetDifficulty: 1 | 2 | 3 | undefined;
}

export default function USE_updateVocabDifficulty() {
  const [privateVocabDifficultyEdit_PROPS, SET_privateVocabDifficultyEdit] =
    useState<privateVocabDifficultyEdit_PROPS>({
      loading: false,
      targetDifficulty: undefined,
    });

  const [updateDifficulty_ERROR, SET_editDifficultyError] = useState<
    string | null
  >(null);

  const toast = useToast();
  const { t } = useTranslation();

  const { z_UPDATE_vocabDifficulty } = USE_zustand();

  const UPDATE_privateVocabDifficulty = async ({
    list_id, // Added list_id
    vocab_id, // Renamed id to vocab_id for clarity
    newDifficulty,
  }: {
    list_id: string; // Added list_id type
    vocab_id: string; // Renamed id to vocab_id
    newDifficulty: 1 | 2 | 3;
  }): Promise<{
    success: boolean;
    msg?: string;
  }> => {
    try {
      SET_privateVocabDifficultyEdit({
        loading: true,
        targetDifficulty: newDifficulty,
      }); // Start loading with targetDifficulty
      SET_editDifficultyError(null); // Reset error state before updating

      const { data, error } = await supabase
        .from("vocabs")
        .update({ difficulty: newDifficulty })
        .eq("id", vocab_id);

      // Handle potential errors
      if (error) {
        console.error("🔴 Error updating vocab difficulty 🔴: ", error);
        SET_editDifficultyError("🔴 Error updating vocab difficulty 🔴");
        return { success: false, msg: "🔴 Error updating vocab difficulty 🔴" };
      }

      // Update vocab difficulty with list_id and vocab_id
      z_UPDATE_vocabDifficulty(list_id, vocab_id, newDifficulty);
      console.log("🟢 Vocab difficulty updated 🟢");
      toast.show(t("notifications.vocabDifficultyUpdated"), {
        type: "green",
        duration: 5000,
      });

      return { success: true };
    } catch (error) {
      console.error(
        "🔴 Unexpected error updating vocab difficulty 🔴: ",
        error
      );
      SET_editDifficultyError("🔴 Unexpected error occurred. 🔴");
      return { success: false, msg: "🔴 Unexpected error occurred. 🔴" };
    } finally {
      // Reset loading state after completion
      SET_privateVocabDifficultyEdit({
        loading: false,
        targetDifficulty: undefined,
      });
    }
  };

  return {
    UPDATE_privateVocabDifficulty,
    privateVocabDifficultyEdit_PROPS,
    updateDifficulty_ERROR,
  };
}
