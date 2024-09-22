///
///
///
import { supabase } from "@/src/lib/supabase";
import { useState } from "react";
import { TranslationCreation_PROPS } from "../models";
interface VocabCreation_MODEL {
  user_id: string;
  list_id: string;
  difficulty?: 1 | 2 | 3;
  description?: string | "";
  image?: string | "";
  translations: TranslationCreation_PROPS[];
  toggleFn: () => void;
}

export default function USE_createVocab() {
  const [IS_creatingVocab, SET_isCreatingVocab] = useState(false);

  const CREATE_newVocab = async (
    props: VocabCreation_MODEL
  ): Promise<{
    success: boolean;
    data?: any;
    msg?: string;
  }> => {
    const {
      user_id,
      list_id,
      difficulty,
      description,
      image,
      translations,
      toggleFn = () => {},
    } = props;

    console.log(translations);

    if (!user_id) {
      console.log("🔴 User not defined when creating vocab 🔴");
      return {
        success: false,
        msg: "🔴 User not defined when creating vocab 🔴",
      };
    }

    if (!list_id) {
      console.log("🔴 List not defined when creating vocab 🔴");
      return {
        success: false,
        msg: "🔴 List not defined when creating vocab 🔴",
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
      SET_isCreatingVocab(true);

      // Insert new vocab
      const { data: vocabData, error: vocabError } = await supabase
        .from("vocabs")
        .insert([vocab_DATA])
        .select()
        .single();

      if (vocabError) {
        console.log("🔴 Error creating vocab 🔴 : ", vocabError);
        return {
          success: false,
          msg: "🔴 Error creating vocab 🔴",
        };
      }

      // Create translations
      const translationPromises = translations.map((translation) => {
        const translation_DATA = {
          vocab_id: vocabData.id, // Link translation to the created vocab
          user_id: user_id,
          lang_id: translation.lang_id,
          text: translation.text,
          highlights: translation.highlights,
        };

        return supabase
          .from("translations")
          .insert([translation_DATA])
          .select();
      });

      const translationResults = await Promise.all(translationPromises);

      // Check if any translation insertions failed
      const failedTranslations = translationResults.filter(
        ({ error }) => error
      );

      if (failedTranslations.length > 0) {
        console.log(
          "🔴 Error creating some translations 🔴",
          failedTranslations
        );
        return {
          success: false,
          msg: "🔴 Error creating some translations 🔴",
        };
      }

      toggleFn();
      return {
        success: true,
        data: { vocabData, translations: translationResults },
      };
    } catch (error) {
      console.log("🔴 Error creating vocab or translations 🔴 : ", error);
      return {
        success: false,
        msg: "🔴 Error creating vocab or translations 🔴",
      };
    } finally {
      SET_isCreatingVocab(false);
    }
  };

  return { CREATE_newVocab, IS_creatingVocab };
}
