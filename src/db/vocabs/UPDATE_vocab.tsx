//
//
//
import { supabase } from "@/src/lib/supabase";
import { useState } from "react";
import { TranslationCreation_PROPS } from "../models";

interface VocabUpdate_MODEL {
  vocab_id: string; // Added vocab_id for identifying the vocab to update
  user_id: string;
  list_id: string;
  difficulty?: 1 | 2 | 3;
  description?: string | "";
  image?: string | "";
  translations: TranslationCreation_PROPS[];
  toggleFn: () => void;
}

export default function USE_updateVocab() {
  const [IS_updatingVocab, SET_isUpdatingVocab] = useState(false);

  const UPDATE_existingVocab = async (
    props: VocabUpdate_MODEL
  ): Promise<{
    success: boolean;
    data?: any;
    msg?: string;
  }> => {
    const {
      vocab_id, // Used to identify the vocab to update
      user_id,
      list_id,
      difficulty,
      description,
      image,
      translations,
      toggleFn = () => {},
    } = props;

    if (!vocab_id) {
      console.log("🔴 Vocab ID not defined when updating vocab 🔴");
      return {
        success: false,
        msg: "🔴 Vocab ID not defined when updating vocab 🔴",
      };
    }

    if (!user_id) {
      console.log("🔴 User not defined when updating vocab 🔴");
      return {
        success: false,
        msg: "🔴 User not defined when updating vocab 🔴",
      };
    }

    if (!list_id) {
      console.log("🔴 List not defined when updating vocab 🔴");
      return {
        success: false,
        msg: "🔴 List not defined when updating vocab 🔴",
      };
    }

    const vocab_DATA: {
      list_id: string;
      user_id: string;
      difficulty?: number;
      description?: string;
      image?: string;
    } = {
      list_id,
      user_id,
    };

    if (difficulty) vocab_DATA.difficulty = difficulty;
    if (description) vocab_DATA.description = description;
    if (image) vocab_DATA.image = image;

    try {
      SET_isUpdatingVocab(true);

      // Update the vocab
      const { data: updatedVocabData, error: vocabError } = await supabase
        .from("vocabs")
        .update(vocab_DATA)
        .eq("id", vocab_id) // Find vocab by its ID
        .select()
        .single();

      if (vocabError) {
        console.log("🔴 Error updating vocab 🔴 : ", vocabError);
        return {
          success: false,
          msg: "🔴 Error updating vocab 🔴",
        };
      }

      // Upsert (insert or update) translations
      const translationPromises = translations.map(async (translation) => {
        const existingTranslation = await supabase
          .from("translations")
          .select("id")
          .eq("vocab_id", vocab_id)
          .eq("lang_id", translation.lang_id)
          .single();

        if (existingTranslation.data) {
          // Update the existing translation
          return supabase
            .from("translations")
            .update({
              text: translation.text,
              highlights: translation.highlights,
            })
            .eq("id", existingTranslation.data.id)
            .select();
        } else {
          // Insert a new translation if it doesn't exist
          return supabase
            .from("translations")
            .insert([
              {
                vocab_id: vocab_id,
                user_id: user_id,
                lang_id: translation.lang_id,
                text: translation.text,
                highlights: translation.highlights,
              },
            ])
            .select();
        }
      });

      const translationResults = await Promise.all(translationPromises);

      // Check for any translation errors
      const failedTranslations = translationResults.filter(
        ({ error }) => error
      );

      if (failedTranslations.length > 0) {
        console.log(
          "🔴 Error updating some translations 🔴",
          failedTranslations
        );
        return {
          success: false,
          msg: "🔴 Error updating some translations 🔴",
        };
      }

      toggleFn();
      return {
        success: true,
        data: { updatedVocabData, translations: translationResults },
      };
    } catch (error) {
      console.log("🔴 Error updating vocab or translations 🔴 : ", error);
      return {
        success: false,
        msg: "🔴 Error updating vocab or translations 🔴",
      };
    } finally {
      SET_isUpdatingVocab(false);
    }
  };

  return { UPDATE_existingVocab, IS_updatingVocab };
}
