import USE_zustand from "@/src/zustand";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";
import db, { Vocabs_DB } from "@/src/db";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";

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

  const UPDATE_privateVocabDifficulty = async ({
    vocab_id, // Renamed id to vocab_id for clarity
    newDifficulty,
  }: {
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

      // Fetch the vocab record based on vocab_id
      const vocab = await Vocabs_DB.find(vocab_id);

      // Update the vocab difficulty
      await db.write(async () => {
        await vocab.update((vocabRecord: Vocab_MODEL) => {
          vocabRecord.difficulty = newDifficulty;
        });
      });

      toast.show(t("notifications.vocabDifficultyUpdated"), {
        type: "green",
        duration: 5000,
      });

      return { success: true };
    } catch (error) {
      console.error("🔴 Error updating vocab difficulty 🔴: ", error);
      SET_editDifficultyError("🔴 Error updating vocab difficulty 🔴");
      return { success: false, msg: "🔴 Error updating vocab difficulty 🔴" };
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
