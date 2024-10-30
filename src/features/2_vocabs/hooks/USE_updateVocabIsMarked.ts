import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";
import db, { Vocabs_DB } from "@/src/db";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";

export interface privateVocabDifficultyEdit_PROPS {
  loading: boolean;
  targetDifficulty: 1 | 2 | 3 | undefined;
}

export default function USE_updateVocabIsMarked() {
  const [loading, SET_loading] = useState(false);

  const [updateMarked_ERROR, SET_error] = useState<string | null>(null);

  const toast = useToast();
  const { t } = useTranslation();

  const UPDATE_vocabMarked = async (
    vocab_id: string | undefined
  ): Promise<{
    success: boolean;
    msg?: string;
  }> => {
    try {
      SET_loading(true);
      SET_error(null); // Reset error state before updating

      if (!vocab_id) return { success: false };

      // Fetch the vocab record based on vocab_id
      const vocab = await Vocabs_DB.find(vocab_id);

      // Update the vocab difficulty
      await db.write(async () => {
        await vocab.update((vocabRecord: Vocab_MODEL) => {
          vocabRecord.is_marked = !vocab.is_marked;
        });
      });

      if (!vocab.is_marked) {
        toast.show(t("notifications.markedVocab"), {
          type: "green",
          duration: 2000,
        });
      }

      return { success: true };
    } catch (error) {
      console.error("🔴 Error updating vocab difficulty 🔴: ", error);
      SET_error("🔴 Error updating vocab difficulty 🔴");
      return { success: false, msg: "🔴 Error updating vocab difficulty 🔴" };
    } finally {
      // Reset loading state after completion
      SET_loading(false);
    }
  };

  return {
    UPDATE_vocabMarked,
    IS_updatingMarked: loading,
    updateMarked_ERROR,
  };
}
