///
///
///
import { supabase } from "@/src/lib/supabase";
import { useState } from "react";
import { PublicVocab_MODEL, TranslationCreation_PROPS } from "../models";

interface VocabCreation_MODEL {
  user_id: string;
  list_id: string;
  difficulty?: 1 | 2 | 3;
  description?: string | "";
  image?: string | "";
  translations: TranslationCreation_PROPS[];
  toggleFn: () => void;
}

interface CopyVocabProps {
  vocab: PublicVocab_MODEL | undefined;
  list_id: string | undefined;
  user_id: string | undefined;
  toggleFn: () => void;
}

export default function USE_copyPublicVocab({
  vocab,
  list_id,
  user_id,
  toggleFn = () => {},
}: CopyVocabProps) {
  const [IS_copyingVocab, SET_isCopyingVocab] = useState(false);

  const COPY_privateVocab = async (): Promise<{
    success: boolean;
    data?: any;
    msg?: string;
  }> => {
    if (!vocab) {
      console.log("🔴 Vocab not defined when copying vocab 🔴");
      return {
        success: false,
        msg: "🔴 Vocab not defined when copying vocab 🔴",
      };
    }
    const { description, image, public_translations = [] } = vocab;

    if (!user_id) {
      console.log("🔴 User not defined when copying vocab 🔴");
      return {
        success: false,
        msg: "🔴 User not defined when copying vocab 🔴",
      };
    }

    if (!list_id) {
      console.log("🔴 List not defined when copying vocab 🔴");
      return {
        success: false,
        msg: "🔴 List not defined when copying vocab 🔴",
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
      difficulty: 3,
      description,
      image,
    };

    try {
      SET_isCopyingVocab(true);

      // Insert new private vocab
      const { data: vocabData, error: vocabError } = await supabase
        .from("vocabs")
        .insert([vocab_DATA])
        .select()
        .single();

      if (vocabError) {
        console.log("🔴 Error copying vocab 🔴 : ", vocabError);
        return {
          success: false,
          msg: "🔴 Error copying vocab 🔴",
        };
      }

      // Copy translations for the new vocab
      const translationPromises = public_translations.map((translation) => {
        const translation_DATA = {
          vocab_id: vocabData.id, // Link translation to the new vocab ID
          user_id,
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
      console.log("🔴 Error copying vocab or translations 🔴 : ", error);
      return {
        success: false,
        msg: "🔴 Error copying vocab or translations 🔴",
      };
    } finally {
      SET_isCopyingVocab(false);
    }
  };

  return { COPY_privateVocab, IS_copyingVocab };
}
